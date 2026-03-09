import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Landmark, MailCheck, Loader2 } from 'lucide-react';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '../../utils/validationSchemas';
import { authService } from '../../services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError('');
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(data);
      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 p-4">
      <Card className="w-full max-w-[440px] shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Landmark className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Zaboravljena lozinka</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <MailCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold">Proverite vaš email</h3>
              <p className="text-sm text-muted-foreground">
                Ukoliko nalog sa unetim email-om postoji, poslaćemo vam link za
                resetovanje lozinke.
              </p>
              <Button className="w-full" onClick={() => navigate('/login')}>
                Nazad na prijavu
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Unesite vašu email adresu i poslaćemo vam link za resetovanje
                lozinke.
              </p>

              {serverError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email adresa</Label>
                  <Input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="ime@primer.com"
                    autoFocus
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Slanje...
                    </>
                  ) : (
                    'Pošalji link za resetovanje'
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                >
                  Nazad na prijavu
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
