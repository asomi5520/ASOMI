/* =========================================================
   ASOMI ENTERPRISE
   ADMIN DASHBOARD
   SUPABASE AUTH + CATEGORY PHOTO UPLOAD
========================================================= */


/* =========================================
   SUPABASE INITIALIZATION
========================================= */

let supabaseClient;

try {

    if (!window.supabase) {
        throw new Error(
            "Supabase library did not load."
        );
    }

    if (
        typeof SUPABASE_URL === "undefined" ||
        typeof SUPABASE_PUBLISHABLE_KEY === "undefined"
    ) {
        throw new Error(
            "config.js did not load correctly."
        );
    }

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

} catch (error) {

    console.error(
        "Supabase initialization error:",
        error
    );

    showFatalError(error.message);
}


/* =========================================
   HTML ELEMENTS
========================================= */

const loadingScreen =
    document.getElementById("loadingScreen");

const dashboard =
    document.getElementById("dashboard");

const adminEmail =
    document.getElementById("adminEmail");

const logoutBtn =
    document.getElementById("logoutBtn");

const uploadButton =
    document.getElementById("uploadButton");

const uploadBox =
    document.getElementById("uploadBox");

const selectButton =
    document.getElementById("selectButton");

const photoInput =
    document.getElementById("photoInput");

const photoCategory =
    document.getElementById("photoCategory");

const selectedFile =
    document.getElementById("selectedFile");

const confirmUpload =
    document.getElementById("confirmUpload");

const uploadStatus =
    document.getElementById("uploadStatus");

const photoGrid =
    document.getElementById("photoGrid");

const totalPhotos =
    document.getElementById("totalPhotos");

const refreshButton =
    document.getElementById("refreshButton");


/* =========================================
   SHOW ERROR
========================================= */

function showFatalError(message) {

    if (!loadingScreen) return;

    loadingScreen.innerHTML = `
        <div style="
            max-width:500px;
            padding:30px;
            text-align:center;
            font-family:Arial,sans-serif;
        ">

            <div style="
                font-size:45px;
                margin-bottom:15px;
            ">
                ⚠️
            </div>

            <h2>
                Admin Connection Error
            </h2>

            <p style="
                line-height:1.6;
                color:#666;
            ">
                ${escapeHtml(message)}
            </p>

            <button
                onclick="location.reload()"
                style="
                    margin-top:15px;
                    padding:12px 22px;
                    border:none;
                    border-radius:8px;
                    cursor:pointer;
                    background:#111;
                    color:white;
                "
            >
                Retry
            </button>

        </div>
    `;
}


/* =========================================
   CHECK AUTHENTICATION
========================================= */

async function checkAuthentication() {

    if (!supabaseClient) {
        return;
    }

    try {

        console.log(
            "Checking Supabase authentication..."
        );


        /*
           TIMEOUT PROTECTION

           If Supabase takes more than 10 seconds,
           don't keep the page loading forever.
        */

        const sessionPromise =
            supabaseClient.auth.getSession();


        const timeoutPromise =
            new Promise((_, reject) => {

                setTimeout(() => {

                    reject(
                        new Error(
                            "Authentication request timed out. Please check your internet connection and Supabase configuration."
                        )
                    );

                }, 10000);

            });


        const result =
            await Promise.race([
                sessionPromise,
                timeoutPromise
            ]);


        const {
            data,
            error
        } = result;


        console.log(
            "Authentication result:",
            data
        );


        if (error) {

            throw error;

        }


        if (!data || !data.session) {

            console.log(
                "No active session. Redirecting to login..."
            );

            window.location.href =
                "login.html";

            return;
        }


        const user =
            data.session.user;


        console.log(
            "Logged in user:",
            user.email
        );


        /* SHOW ADMIN */

        if (adminEmail) {

            adminEmail.textContent =
                user.email;

        }


        if (loadingScreen) {

            loadingScreen.style.display =
                "none";

        }


        if (dashboard) {

            dashboard.style.display =
                "flex";

        }


        /* LOAD PHOTOS */

        await loadPhotos();


    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );


        showFatalError(
            error.message ||
            "Unable to connect to Supabase."
        );

    }

}


/* =========================================
   AUTH STATE LISTENER
========================================= */

if (supabaseClient) {

    supabaseClient.auth.onAuthStateChange(
        (event, session) => {

            console.log(
                "Auth event:",
                event
            );


            /*
               Don't redirect immediately during
               INITIAL_SESSION because checkAuthentication()
               is handling the initial state.
            */

            if (
                event !== "INITIAL_SESSION" &&
                !session
            ) {

                window.location.href =
                    "login.html";

            }

        }
    );

}


/* =========================================
   LOGOUT
========================================= */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            logoutBtn.disabled = true;

            try {

                const {
                    error
                } =
                    await supabaseClient.auth.signOut();


                if (error) {

                    throw error;

                }


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Logout failed: " +
                    error.message
                );


                logoutBtn.disabled = false;

            }

        }
    );

}


/* =========================================
   OPEN UPLOAD BOX
========================================= */

if (uploadButton) {

    uploadButton.addEventListener(
        "click",
        () => {

            if (!uploadBox) return;


            uploadBox.style.display =
                uploadBox.style.display === "block"
                    ? "none"
                    : "block";

        }
    );

}


/* =========================================
   SELECT FILE
========================================= */

if (selectButton && photoInput) {

    selectButton.addEventListener(
        "click",
        () => {

            photoInput.click();

        }
    );

}


/* =========================================
   FILE SELECTED
========================================= */

if (photoInput) {

    photoInput.addEventListener(
        "change",
        () => {

            const file =
                photoInput.files[0];


            if (!file) {

                if (selectedFile) {
                    selectedFile.textContent =
                        "";
                }

                if (confirmUpload) {
                    confirmUpload.style.display =
                        "none";
                }

                return;

            }


            /* IMAGE CHECK */

            if (
                !file.type.startsWith("image/")
            ) {

                alert(
                    "Please select an image file."
                );

                photoInput.value = "";

                return;

            }


            if (selectedFile) {

                selectedFile.textContent =
                    `Selected: ${file.name}`;

            }


            if (confirmUpload) {

                confirmUpload.style.display =
                    "inline-block";

            }

        }
    );

}


/* =========================================
   UPLOAD PHOTO
========================================= */

if (confirmUpload) {

    confirmUpload.addEventListener(
        "click",
        async () => {

            const file =
                photoInput.files[0];


            /* CHECK FILE */

            if (!file) {

                alert(
                    "Please select a photo first."
                );

                return;

            }


            /* CHECK CATEGORY */

            if (!photoCategory) {

                alert(
                    "Category selector not found in admin.html."
                );

                return;

            }


            const category =
                photoCategory.value;


            if (!category) {

                alert(
                    "Please select a service category first."
                );

                photoCategory.focus();

                return;

            }


            confirmUpload.disabled =
                true;


            if (uploadStatus) {

                uploadStatus.textContent =
                    "Uploading...";

            }


            try {

                /* FILE EXTENSION */

                const fileExtension =
                    file.name
                        .split(".")
                        .pop()
                        .toLowerCase();


                /* UNIQUE FILE NAME */

                const fileName =
                    `${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2, 8)}
                        .${fileExtension}`
                        .replace(/\s/g, "");


                /*
                   IMPORTANT

                   Photos are stored like:

                   website-images/
                   ├── Digital Printing/
                   │   └── photo.jpg
                   ├── Visiting Cards/
                   │   └── photo.jpg
                   └── Book Printing/
                       └── photo.jpg
                */

                const filePath =
                    `${category}/${fileName}`;


                console.log(
                    "Uploading:",
                    filePath
                );


                const {
                    error
                } =
                    await supabaseClient.storage
                        .from("website-images")
                        .upload(
                            filePath,
                            file,
                            {
                                cacheControl:
                                    "3600",
                                upsert:
                                    false
                            }
                        );


                if (error) {

                    throw error;

                }


                console.log(
                    "Upload successful:",
                    filePath
                );


                if (uploadStatus) {

                    uploadStatus.textContent =
                        "✓ Photo uploaded successfully.";

                }


                /* RESET */

                photoInput.value = "";


                if (selectedFile) {

                    selectedFile.textContent =
                        "";

                }


                confirmUpload.style.display =
                    "none";


                photoCategory.value =
                    "";


                /* RELOAD PHOTOS */

                await loadPhotos();


            } catch (error) {

                console.error(
                    "Upload error:",
                    error
                );


                if (uploadStatus) {

                    uploadStatus.textContent =
                        "Upload failed: " +
                        error.message;

                }

            }


            confirmUpload.disabled =
                false;

        }
    );

}


/* =========================================
   LOAD PHOTOS
========================================= */

async function loadPhotos() {

    if (!photoGrid) return;


    photoGrid.innerHTML = `
        <div class="empty-state">
            <div>⟳</div>
            <p>Loading photos...</p>
        </div>
    `;


    try {

        /*
           Because photos are now inside
           category folders, we load each folder.
        */

        const categories = [

            "Digital Printing",
            "Flex & Banner Printing",
            "Visiting Cards",
            "Pamphlets & Flyers",
            "Brochures",
            "Letterheads",
            "Bill Books",
            "ID Cards",
            "Certificates",
            "Stickers & Labels",
            "Photo Printing",
            "Custom Printing Services",
            "Book Printing"

        ];


        let allPhotos = [];


        /* LOAD EVERY CATEGORY */

        for (
            const category
            of categories
        ) {

            const {
                data,
                error
            } =
                await supabaseClient.storage
                    .from("website-images")
                    .list(
                        category,
                        {
                            limit: 100,
                            sortBy: {
                                column:
                                    "created_at",
                                order:
                                    "desc"
                            }
                        }
                    );


            if (error) {

                console.error(
                    `Error loading ${category}:`,
                    error
                );

                continue;

            }


            if (!data) continue;


            data.forEach(file => {

                if (
                    file.name ===
                    ".emptyFolderPlaceholder"
                ) {
                    return;
                }


                allPhotos.push({

                    name:
                        file.name,

                    path:
                        `${category}/${file.name}`,

                    category:
                        category,

                    created_at:
                        file.created_at

                });

            });

        }


        /* SORT NEWEST FIRST */

        allPhotos.sort(
            (a, b) =>
                new Date(b.created_at || 0) -
                new Date(a.created_at || 0)
        );


        /* TOTAL */

        if (totalPhotos) {

            totalPhotos.textContent =
                allPhotos.length;

        }


        /* NO PHOTOS */

        if (allPhotos.length === 0) {

            photoGrid.innerHTML = `
                <div class="empty-state">
                    <div>▧</div>
                    <p>No photos uploaded yet.</p>
                </div>
            `;

            return;

        }


        /* CLEAR */

        photoGrid.innerHTML =
            "";


        /* CREATE PHOTO CARDS */

        allPhotos.forEach(
            photo => {


                const {
                    data:
                        publicUrlData
                } =
                    supabaseClient.storage
                        .from("website-images")
                        .getPublicUrl(
                            photo.path
                        );


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "photo-card";


                card.innerHTML = `

                    <img
                        class="photo-image"
                        src="${publicUrlData.publicUrl}"
                        alt="${escapeHtml(photo.name)}"
                    >

                    <div class="photo-info">

                        <span
                            class="photo-name"
                        >
                            ${escapeHtml(
                                photo.name
                            )}
                        </span>

                        <small
                            style="
                                display:block;
                                margin-top:5px;
                                opacity:.7;
                            "
                        >
                            ${escapeHtml(
                                photo.category
                            )}
                        </small>

                        <button
                            class="delete-button"
                        >
                            Delete Photo
                        </button>

                    </div>

                `;


                const deleteButton =
                    card.querySelector(
                        ".delete-button"
                    );


                if (deleteButton) {

                    deleteButton.addEventListener(
                        "click",
                        () =>
                            deletePhoto(
                                photo.path
                            )
                    );

                }


                photoGrid.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Load photos error:",
            error
        );


        photoGrid.innerHTML = `
            <div class="empty-state">

                <div>⚠</div>

                <p>
                    Could not load photos.
                </p>

                <small>
                    ${escapeHtml(
                        error.message
                    )}
                </small>

            </div>
        `;

    }

}


/* =========================================
   DELETE PHOTO
========================================= */

async function deletePhoto(
    filePath
) {

    const confirmDelete =
        confirm(
            `Delete "${filePath}"?\n\nThis cannot be undone.`
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient.storage
                .from("website-images")
                .remove([
                    filePath
                ]);


        if (error) {

            throw error;

        }


        await loadPhotos();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Delete failed: " +
            error.message
        );

    }

}


/* =========================================
   REFRESH
========================================= */

if (refreshButton) {

    refreshButton.addEventListener(
        "click",
        () => {

            loadPhotos();

        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHtml(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   START ADMIN
========================================= */

console.log(
    "ASOMI ADMIN: Starting..."
);


checkAuthentication();