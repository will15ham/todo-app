import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, EyeOffIcon, EyeIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const usePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  return { showPassword, togglePasswordVisibility };
};

export const PasswordInput = ({
  id,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => {
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <LockIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          id={id}
          name={id}
          type={showPassword ? "text" : "password"}
          className="pl-10 pr-10"
          required
          {...props}
        />
        <Button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          variant="ghost"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
        </Button>
      </div>
    </motion.div>
  );
};

export const EmailInput = () => (
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <div className="relative">
      <MailIcon
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        size={20}
      />
      <Input
        id="email"
        name="email"
        placeholder="you@example.com"
        type="email"
        className="pl-10"
        required
      />
    </div>
  </div>
);
