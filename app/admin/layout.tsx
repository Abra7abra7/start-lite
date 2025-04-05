import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- Authentication & Authorization Check ---
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in, redirect to login page (adjust path if needed)
    return redirect('/prihlasenie?message=Pre prístup do administrácie sa musíte prihlásiť.');
  }

  /* --- TEMPORARILY COMMENTED OUT FOR DEVELOPMENT ---
  // TODO: Re-enable role check and ensure profiles table/trigger works before production!
  // Fetch user profile to check role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error("Error fetching user profile:", profileError);
    // Handle error appropriately, maybe show an error page or redirect
    return redirect('/?error=Nepodarilo sa načítať profil používateľa.');
  }

  if (profile?.role !== 'admin') {
    // Not an admin, redirect to home page or an unauthorized page
    return redirect('/?error=Nemáte oprávnenie na prístup do tejto sekcie.');
  }
  --- END OF TEMPORARY COMMENT --- */

  // --- Admin Layout Structure ---
  return (
    <div className="flex min-h-screen">
      {/* TODO: Add Admin Sidebar Navigation */} 
      <aside className="w-64 bg-gray-100 p-4 border-r hidden md:block">
        <h2 className="text-xl font-semibold mb-4">Admin Menu</h2>
        {/* Placeholder for navigation links */}
        <ul>
          <li>Produkty</li>
          <li>Objednávky (TODO)</li>
          <li>Používatelia (TODO)</li>
        </ul>
      </aside>
      <main className="flex-1 p-6 lg:p-8">
        {/* TODO: Add Admin Header? */} 
        {children}
      </main>
    </div>
  );
}
