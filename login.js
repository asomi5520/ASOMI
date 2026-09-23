/* =========================================
   ASOMI ENTERPRISE
   ADMIN LOGIN
========================================= */

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* Elements */

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginBtn =
    document.getElementById("loginBtn");

const loginText =
    document.getElementById("loginText");

const loader =
    document.getElementById("loader");

const arrowIcon =
    document.getElementById("arrowIcon");

const message =
    document.getElementById("message");

const togglePassword =
    document.getElementById("togglePassword");


/* =========================================
   PASSWORD SHOW / HIDE
========================================= */

togglePassword.addEventListener(
    "click",
    () => {

        const isPassword =
            passwordInput.type === "password";


        passwordInput.type =
            isPassword
                ? "text"
                : "password";


        togglePassword.innerHTML =
            isPassword
                ? `
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                    >
                        <path
                            d="M3 3l18 18"
                        />

                        <path
                            d="M10.58 10.58
                               a2 2 0 0 0 2.83 2.83"
                        />

                        <path
                            d="M9.88 4.24
                               A10.94 10.94 0 0 1
                               12 4c7 0 11 8
                               11 8a18.5 18.5 0 0 1
                               -3.16 4.19"
                        />

                        <path
                            d="M6.61 6.61
                               A18.5 18.5 0 0 0
                               1 12s4 8 11 8
                               a10.94 10.94 0 0 0
                               5.12-1.24"
                        />
                    </svg>
                `
                : `
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                    >
                        <path
                            d="M1 12s4-8 11-8
                               11 8 11 8-4 8-11 8
                               S1 12 1 12z"
                        />

                        <circle
                            cx="12"
                            cy="12"
                            r="3"
                        />
                    </svg>
                `;

    }
);


/* =========================================
   LOGIN
========================================= */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;


        /* Clear message */

        message.textContent = "";

        message.style.color =
            "#f87171";


        /* Validation */

        if (!email || !password) {

            message.textContent =
                "Please enter your email and password.";

            return;
        }


        /* Loading */

        loginBtn.disabled = true;

        loginText.textContent =
            "Authenticating...";

        loader.style.display =
            "inline-block";

        arrowIcon.style.display =
            "none";


        try {

            /* Supabase login */

            const {
                data,
                error
            } =
                await supabaseClient.auth
                    .signInWithPassword({
                        email: email,
                        password: password
                    });


            /* Error */

            if (error) {

                throw error;

            }


            /* Success */

            message.style.color =
                "#4ade80";

            message.textContent =
                "Login successful. Opening dashboard...";


            loginText.textContent =
                "Access Granted";


            /* Redirect */

            setTimeout(() => {

                window.location.href =
                    "admin.html";

            }, 700);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            message.style.color =
                "#f87171";


            /*
             * Keep the message simple.
             * Supabase intentionally doesn't distinguish
             * invalid email vs invalid password.
             */

            message.textContent =
                "Invalid email or password.";


            /* Reset */

            loginBtn.disabled =
                false;

            loginText.textContent =
                "Sign In to Dashboard";

            loader.style.display =
                "none";

            arrowIcon.style.display =
                "block";

        }

    }
);


/* =========================================
   CHECK EXISTING SESSION
========================================= */

async function checkExistingSession() {

    const {
        data
    } =
        await supabaseClient.auth.getSession();


    if (data.session) {

        window.location.href =
            "admin.html";

    }

}


/* Run */

checkExistingSession();