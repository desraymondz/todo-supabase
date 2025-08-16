import { login, signup, loginWithGoogle } from './actions'

export default function LoginPage() {
    return (
        <form>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" />
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" />
            <button formAction={login}>Log in</button>
            <button formAction={signup}>Sign up</button>

            <hr />

            {/* Google login */}
            <button formAction={loginWithGoogle} type="submit">
                Continue with Google
            </button>
        </form>
    )
}