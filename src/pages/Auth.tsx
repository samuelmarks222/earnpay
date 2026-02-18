import { useState, useRef, useCallback } from "react";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2, Camera, Upload, CheckCircle2, XCircle, ChevronDown, Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { countries } from "@/lib/countries";
import { Progress } from "@/components/ui/progress";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => String(currentYear - 13 - i));

type SignupStep = 1 | 2 | 3;

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup multi-step state
  const [step, setStep] = useState<SignupStep>(1);
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regDobMonth, setRegDobMonth] = useState("");
  const [regDobDay, setRegDobDay] = useState("");
  const [regDobYear, setRegDobYear] = useState("");
  const [regGender, setRegGender] = useState("");
  const [regCountry, setRegCountry] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  // Photo step state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "verifying" | "valid" | "invalid">("idle");
  const [verifyReason, setVerifyReason] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password strength
  const passwordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = passwordStrength(regPassword);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-destructive", "bg-yellow-500", "bg-blue-500", "bg-primary"][strength];

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Login handler
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Missing fields", description: "Please enter email and password.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  // Google OAuth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
    }
  };

  // Step 1 validation
  const handleStep1 = () => {
    if (!regFirstName.trim() || !regLastName.trim()) {
      toast({ title: "Name required", description: "Please enter your first and last name.", variant: "destructive" });
      return;
    }
    if (!regEmail || !/\S+@\S+\.\S+/.test(regEmail)) {
      toast({ title: "Valid email required", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    if (regPassword.length < 8) {
      toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    if (!regDobMonth || !regDobDay || !regDobYear) {
      toast({ title: "Date of birth required", description: "Please enter your full date of birth.", variant: "destructive" });
      return;
    }
    if (!regGender) {
      toast({ title: "Gender required", description: "Please select your gender.", variant: "destructive" });
      return;
    }
    if (!regCountry) {
      toast({ title: "Country required", description: "Please select your country.", variant: "destructive" });
      return;
    }
    setStep(2);
  };

  // Photo handlers
  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
      setPhotoFile(file);
      setVerifyStatus("idle");
      setVerifyReason("");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      toast({ title: "Camera error", description: "Could not access your camera. Please upload a photo instead.", variant: "destructive" });
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        handleFileSelect(file);
        stopCamera();
      }
    }, "image/jpeg", 0.9);
  };

  const verifyPhoto = async () => {
    if (!photoFile || !photoPreview) return;
    setVerifyStatus("verifying");

    // Convert to base64 (strip data URL prefix)
    const base64 = photoPreview.split(",")[1];

    try {
      const { data, error } = await supabase.functions.invoke("verify-face", {
        body: { imageBase64: base64 },
      });

      if (error) throw error;

      if (data.valid) {
        setVerifyStatus("valid");
        setVerifyReason(data.reason ?? "Photo verified!");
      } else {
        setVerifyStatus("invalid");
        setVerifyReason(data.reason ?? "Photo not accepted. Please upload a clear photo of your face.");
      }
    } catch (err) {
      setVerifyStatus("invalid");
      setVerifyReason("Verification failed. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (verifyStatus !== "valid") {
      toast({ title: "Photo required", description: "Please upload and verify a valid profile photo.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const fullName = `${regFirstName.trim()} ${regLastName.trim()}`;
    const dob = `${regDobYear}-${String(MONTHS.indexOf(regDobMonth) + 1).padStart(2, "0")}-${String(parseInt(regDobDay)).padStart(2, "0")}`;

    const { error } = await signUp(regEmail, regPassword, fullName);
    if (error) {
      setLoading(false);
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }

    // Wait briefly for session to be established, then upload photo & update profile
    setTimeout(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && photoFile) {
          const userId = session.user.id;
          const filePath = `${userId}/avatar.jpg`;
          await supabase.storage.from("avatars").upload(filePath, photoFile, { upsert: true });
          const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
          await supabase.from("profiles").update({
            country: regCountry,
            gender: regGender,
            date_of_birth: dob,
            avatar_url: publicUrl,
          }).eq("id", userId);
        }
      } catch (e) {
        console.error("Profile update error:", e);
      }
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  const progressValue = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-5">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="gradient-earn flex h-10 w-10 items-center justify-center rounded-xl glow-earn">
              <span className="font-display text-base font-bold text-primary-foreground">SE</span>
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Social<span className="text-primary">Earn</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Where your time is valued</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-lg border-border">
            <Tabs defaultValue="login">
              <CardHeader className="pb-2">
                <TabsList className="w-full">
                  <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
                  <TabsTrigger value="register" className="flex-1" onClick={() => setStep(1)}>Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>

              {/* ========== LOGIN ========== */}
              <TabsContent value="login">
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@example.com" className="pl-9" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-9 pr-9" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button className="w-full gradient-earn text-primary-foreground gap-2" onClick={handleLogin} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">or</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn} disabled={loading}>
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>
                </CardContent>
              </TabsContent>

              {/* ========== REGISTER ========== */}
              <TabsContent value="register">
                <CardContent className="space-y-4">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Step {step} of 3</span>
                      <span>{step === 1 ? "Basic Info" : step === 2 ? "Profile Photo" : "Complete!"}</span>
                    </div>
                    <Progress value={progressValue} className="h-1.5" />
                  </div>

                  <AnimatePresence mode="wait">
                    {/* STEP 1 */}
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                        {/* Name row */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label htmlFor="reg-first">First Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input id="reg-first" placeholder="First" className="pl-9" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="reg-last">Last Name</Label>
                            <Input id="reg-last" placeholder="Last" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                          <Label htmlFor="reg-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="reg-email" type="email" placeholder="you@example.com" className="pl-9" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                          </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                          <Label htmlFor="reg-password">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="reg-password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" className="pl-9 pr-9" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {regPassword && (
                            <div className="space-y-1">
                              <div className="flex gap-1">
                                {[1,2,3,4].map(i => (
                                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-muted"}`} />
                                ))}
                              </div>
                              <p className="text-xs text-muted-foreground">{strengthLabel}</p>
                            </div>
                          )}
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-1">
                          <Label>Date of Birth</Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Select value={regDobMonth} onValueChange={setRegDobMonth}>
                              <SelectTrigger className="text-sm"><SelectValue placeholder="Month" /></SelectTrigger>
                              <SelectContent>
                                {MONTHS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <Select value={regDobDay} onValueChange={setRegDobDay}>
                              <SelectTrigger className="text-sm"><SelectValue placeholder="Day" /></SelectTrigger>
                              <SelectContent>
                                {DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <Select value={regDobYear} onValueChange={setRegDobYear}>
                              <SelectTrigger className="text-sm"><SelectValue placeholder="Year" /></SelectTrigger>
                              <SelectContent>
                                {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-1">
                          <Label>Gender</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Male", "Female", "Other"].map(g => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => setRegGender(g)}
                                className={`rounded-lg border py-2 text-sm font-medium transition-all ${regGender === g ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:bg-secondary"}`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Country */}
                        <div className="space-y-1">
                          <Label>Country <span className="text-destructive">*</span></Label>
                          <Select value={regCountry} onValueChange={(v) => { setRegCountry(v); setCountrySearch(""); }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                            <SelectContent>
                              <div className="p-2">
                                <div className="relative">
                                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                  <Input
                                    placeholder="Search country..."
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    className="pl-7 h-8 text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                              {filteredCountries.map(c => (
                                <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Button className="w-full gradient-earn text-primary-foreground gap-2" onClick={handleStep1}>
                          Continue <ArrowRight className="h-4 w-4" />
                        </Button>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">or</span>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn} disabled={loading}>
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Continue with Google
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">By signing up, you agree to our Terms and Privacy Policy</p>
                      </motion.div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                        <div className="text-center">
                          <h3 className="font-display font-semibold text-base text-foreground">Add a Profile Photo</h3>
                          <p className="text-sm text-muted-foreground mt-1">Upload a clear photo of your face. We'll verify it's a real person photo.</p>
                        </div>

                        {/* Camera view */}
                        {showCamera ? (
                          <div className="relative">
                            <video ref={videoRef} className="w-full rounded-xl aspect-square object-cover" autoPlay muted playsInline />
                            <canvas ref={canvasRef} className="hidden" />
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" className="flex-1" onClick={stopCamera}>Cancel</Button>
                              <Button className="flex-1 gradient-earn text-primary-foreground" onClick={capturePhoto}>
                                <Camera className="h-4 w-4 mr-2" /> Capture
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Photo preview or placeholder */}
                            <div className="flex flex-col items-center gap-3">
                              <div className={`relative w-36 h-36 rounded-full border-4 overflow-hidden transition-all ${verifyStatus === "valid" ? "border-primary" : verifyStatus === "invalid" ? "border-destructive" : "border-border"}`}>
                                {photoPreview ? (
                                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                                    <Camera className="h-12 w-12 text-muted-foreground" />
                                  </div>
                                )}
                                {verifyStatus === "valid" && (
                                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                    <CheckCircle2 className="h-10 w-10 text-primary" />
                                  </div>
                                )}
                              </div>

                              {verifyStatus === "verifying" && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                  Analyzing photo…
                                </div>
                              )}
                              {verifyStatus === "valid" && (
                                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                                  <CheckCircle2 className="h-4 w-4" />
                                  {verifyReason}
                                </div>
                              )}
                              {verifyStatus === "invalid" && (
                                <div className="flex items-start gap-2 text-sm text-destructive">
                                  <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                  <span>{verifyReason}</span>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <Button variant="outline" className="gap-2" onClick={startCamera}>
                                <Camera className="h-4 w-4" /> Take Photo
                              </Button>
                              <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="h-4 w-4" /> Upload Photo
                              </Button>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />

                            {photoPreview && verifyStatus !== "valid" && (
                              <Button variant="secondary" className="w-full" onClick={verifyPhoto} disabled={verifyStatus === "verifying"}>
                                {verifyStatus === "verifying" ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying…</> : "Verify Photo"}
                              </Button>
                            )}
                          </>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                          <Button
                            className="flex-1 gradient-earn text-primary-foreground gap-2"
                            onClick={handleRegister}
                            disabled={loading || verifyStatus !== "valid"}
                          >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
                          </Button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3 — Success */}
                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-4">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                          <div className="mx-auto w-20 h-20 rounded-full gradient-earn glow-earn flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                          </div>
                        </motion.div>
                        <div>
                          <h3 className="font-display text-xl font-bold text-foreground">Welcome to SocialEarn!</h3>
                          <p className="text-sm text-muted-foreground mt-1">Your account has been created. Check your email to verify your account, then start earning!</p>
                        </div>
                        <Button className="w-full gradient-earn text-primary-foreground gap-2" onClick={() => navigate("/")}>
                          Go to Feed <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
