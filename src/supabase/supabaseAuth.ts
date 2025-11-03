import { supabase } from './supabaseClient'

async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
        },
    })
    if (error) console.error('Erreur Google Auth:', error.message)
}

async function signInWithDiscord() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: window.location.origin,
        },
    })
    if (error) console.error('Erreur Discord Auth:', error.message)
}
