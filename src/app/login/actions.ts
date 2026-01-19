'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendPasswordResetEmail, sendLoginEmail } from '@/lib/email'

export type ActionState = {
  error?: string
  success?: string
} | null

export async function login(prevState: ActionState, formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: (formData.get('email') as string || '').trim(),
    password: (formData.get('password') as string || '').trim(),
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  await sendLoginEmail(data.email)

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: ActionState, formData: FormData) {
  const supabase = await createClient()

  const email = (formData.get('email') as string || '').trim()
  const password = (formData.get('password') as string || '').trim()

  // 1. Sign up the user
  const { data: authData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signupError) {
    return redirect(`/login?message=${encodeURIComponent(signupError.message)}`)
  }

  // 2. If no session was returned (common if 'Confirm Email' is ON in Supabase),
  // we attempt to sign them in immediately.
  // Note: This only works if 'Confirm Email' is OFF in your Supabase dashboard.
  // If you want to bypass this programmatically, you can use the admin client.

  let session = authData.session

  if (!session) {
    // Attempt an immediate sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      // If we still can't sign in, it's likely because email confirmation is REQUIRED by Supabase.
      return redirect(`/login?message=Account created! Please check your email to confirm and log in.`)
    }
    session = signInData.session
  }

  // Send welcome email
  if (email) {
    const result = await sendWelcomeEmail(email)
    if (result?.error) {
      console.error('Welcome email failed to send:', result.error)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?new_user=true')
}

export async function requestPasswordReset(prevState: ActionState, formData: FormData) {
  const adminSupabase = await createAdminClient()
  const email = (formData.get('email') as string || '').trim()

  if (!email) {
    return { error: 'Email is required' }
  }

  // Generate a reset link without sending an email
  const { data, error: linkError } = await adminSupabase.auth.admin.generateLink({
    type: 'recovery',
    email: email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    }
  })

  if (linkError) {
    return { error: linkError.message }
  }

  // Send the link via Resend
  const { error: emailError } = await sendPasswordResetEmail(email, data.properties.action_link)

  if (emailError) {
    return { error: 'Failed to send reset email. Please try again later.' }
  }

  return { success: 'Check your email for the reset link.' }
}

export async function updatePassword(prevState: ActionState, formData: FormData) {
  const supabase = await createClient()
  const password = (formData.get('password') as string || '').trim()

  if (!password) {
    return { error: 'Password is required' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Password updated successfully. You can now sign in.' }
}

export async function changePassword(prevState: ActionState, formData: FormData) {
  const supabase = await createClient()
  const currentPassword = (formData.get('currentPassword') as string || '').trim()
  const newPassword = (formData.get('newPassword') as string || '').trim()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return { error: 'Not authenticated' }

  // Verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword
  })

  if (verifyError) {
    return { error: 'Current password is incorrect' }
  }

  // Update to new password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (updateError) {
    return { error: updateError.message }
  }

  return { success: 'Password changed successfully!' }
}
