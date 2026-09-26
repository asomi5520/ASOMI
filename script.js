/* =========================================================
   ASOMI ENTERPRISE
   COMPLETE WEBSITE JAVASCRIPT
   MOUSE / CURSOR ANIMATIONS REMOVED
========================================================= */


/* =========================================================
   1. MOBILE NAVIGATION
========================================================= */

const menuButton =
    document.getElementById("menuButton");

const nav =
    document.getElementById("nav");


if (menuButton && nav) {

    menuButton.addEventListener("click", () => {

        nav.classList.toggle("open");

        const icon =
            menuButton.querySelector("i");

        if (!icon) return;


        if (nav.classList.contains("open")) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");

            icon.classList.add("fa-bars");

        }

    });


    document.querySelectorAll(".nav-link")
        .forEach(link => {

            link.addEventListener("click", () => {

                nav.classList.remove("open");

                const icon =
                    menuButton.querySelector("i");

                if (!icon) return;

                icon.classList.remove("fa-xmark");

                icon.classList.add("fa-bars");

            });

        });

}


/* =========================================================
   2. HEADER SCROLL EFFECT
========================================================= */

const header =
    document.getElementById("header");


if (header) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    });

}


/* =========================================================
   3. ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".nav-link");


window.addEventListener("scroll", () => {

    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
                sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================================================
   4. SERVICE GALLERY DATA
========================================================= */

const galleryData = {

    "Digital Printing": [

        "images/digital-1.jpg",
        "images/digital-2.jpg",
        "images/digital-3.jpg",
        "images/digital-4.jpg",
        "images/digital-5.jpg",
        "images/digital-6.jpg"

    ],


    "Flex & Banner Printing": [

        "images/flex-1.jpg",
        "images/flex-2.jpg",
        "images/flex-3.jpg",
        "images/flex-4.jpg"

    ],


    "Visiting Cards": [

        "images/visiting-card-1.jpg",
        "images/visiting-card-2.jpg",
        "images/visiting-card-3.jpg",
        "images/visiting-card-4.jpg"

    ],


    "Pamphlets & Flyers": [

        "images/pamphlet-1.jpg",
        "images/pamphlet-2.jpg",
        "images/pamphlet-3.jpg",
        "images/pamphlet-4.jpg"

    ],


    "Brochures": [

        "images/brochure-1.jpg",
        "images/brochure-2.jpg",
        "images/brochure-3.jpg",
        "images/brochure-4.jpg"

    ],


    "Letterheads": [

        "images/letterhead-1.jpg",
        "images/letterhead-2.jpg",
        "images/letterhead-3.jpg",
        "images/letterhead-4.jpg"

    ],


    "Bill Books": [

        "images/bill-book-1.jpg",
        "images/bill-book-2.jpg",
        "images/bill-book-3.jpg",
        "images/bill-book-4.jpg"

    ],


    "ID Cards": [

        "images/id-card-1.jpg",
        "images/id-card-2.jpg",
        "images/id-card-3.jpg",
        "images/id-card-4.jpg"

    ],


    "Certificates": [

        "images/certificate-1.jpg",
        "images/certificate-2.jpg",
        "images/certificate-3.jpg",
        "images/certificate-4.jpg"

    ],


    "Stickers & Labels": [

        {
            type: "image",
            src: "images/sticker-1.jpg"
        },

        {
            type: "image",
            src: "images/sticker-2.jpg"
        },

        {
            type: "image",
            src: "images/sticker-3.jpg"
        },

        {
            type: "image",
            src: "images/sticker-4.jpg"
        },

        {
            type: "video",
            src: "images/videos/sticker-5.mp4"
        }

    ],


    "Photo Printing": [

        "images/photo-1.jpg",
        "images/photo-2.jpg",
        "images/photo-3.jpg",
        "images/photo-4.jpg"

    ],


    "Custom Printing Services": [

        "images/custom-1.jpg",
        "images/custom-2.jpg",
        "images/custom-3.jpg",
        "images/custom-4.jpg"

    ],


    "Book Printing": [

        "images/book-1.jpg",
        "images/book-2.jpg",
        "images/book-3.jpg",
        "images/book-4.jpg"

    ]

};


/* =========================================================
   5. SUPABASE
========================================================= */

let supabaseClient = null;


if (
    window.supabase &&
    typeof SUPABASE_URL !== "undefined" &&
    typeof SUPABASE_PUBLISHABLE_KEY !== "undefined"
) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );

}


/* =========================================================
   6. SUPABASE SERVICE NAMES
========================================================= */

const supabaseServiceNames = [

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


/* =========================================================
   7. LOAD SUPABASE PHOTOS
========================================================= */

async function loadSupabasePhotos() {

    if (!supabaseClient) {

        console.warn(
            "Supabase is not configured."
        );

        return;

    }


    console.log(
        "Loading additional photos from Supabase..."
    );


    for (
        const serviceName of
        supabaseServiceNames
    ) {

        try {

            const {
                data,
                error
            } =
                await supabaseClient.storage
                    .from("website-images")
                    .list(
                        serviceName,
                        {
                            limit: 100,

                            sortBy: {
                                column: "created_at",
                                order: "desc"
                            }
                        }
                    );


            if (error) {

                console.error(
                    `Supabase error - ${serviceName}:`,
                    error
                );

                continue;

            }


            if (
                !data ||
                data.length === 0
            ) {

                continue;

            }


            data.forEach(file => {

                if (
                    !file.name ||
                    file.name ===
                    ".emptyFolderPlaceholder"
                ) {

                    return;

                }


                const extension =
                    file.name
                        .split(".")
                        .pop()
                        .toLowerCase();


                const allowedExtensions = [

                    "jpg",
                    "jpeg",
                    "png",
                    "webp",
                    "gif",
                    "avif"

                ];


                if (
                    !allowedExtensions
                        .includes(extension)
                ) {

                    return;

                }


                const filePath =
                    `${serviceName}/${file.name}`;


                const {
                    data: publicData
                } =
                    supabaseClient.storage
                        .from("website-images")
                        .getPublicUrl(
                            filePath
                        );


                if (
                    publicData &&
                    publicData.publicUrl
                ) {

                    galleryData[
                        serviceName
                    ].push({

                        type: "image",

                        src:
                            publicData.publicUrl

                    });

                }

            });


            console.log(
                `${serviceName}: ` +
                `${galleryData[serviceName].length} total photos`
            );


        } catch (error) {

            console.error(
                `Failed loading ${serviceName}:`,
                error
            );

        }

    }


    console.log(
        "Supabase photos successfully added."
    );

}


const supabasePhotosReady =
    loadSupabasePhotos();


/* =========================================================
   8. GALLERY ELEMENTS
========================================================= */

const galleryModal =
    document.getElementById(
        "galleryModal"
    );

const galleryClose =
    document.getElementById(
        "galleryClose"
    );

const galleryOverlay =
    document.getElementById(
        "galleryOverlay"
    );

const galleryTitle =
    document.getElementById(
        "galleryTitle"
    );

const galleryCounter =
    document.getElementById(
        "galleryCounter"
    );

const galleryMainImage =
    document.getElementById(
        "galleryMainImage"
    );

const galleryMainVideo =
    document.getElementById(
        "galleryMainVideo"
    );

const galleryThumbnails =
    document.getElementById(
        "galleryThumbnails"
    );

const galleryPrev =
    document.getElementById(
        "galleryPrev"
    );

const galleryNext =
    document.getElementById(
        "galleryNext"
    );


let currentGallery = [];

let currentIndex = 0;


/* =========================================================
   9. SERVICE CARD CLICK
========================================================= */

document
    .querySelectorAll(".service-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const serviceName =
                    card.dataset.service;

                openGallery(
                    serviceName
                );

            }
        );

    });


/* =========================================================
   10. OPEN GALLERY
========================================================= */

async function openGallery(
    serviceName
) {

    try {

        await supabasePhotosReady;

    } catch (error) {

        console.error(
            "Supabase gallery loading error:",
            error
        );

    }


    currentGallery =
        galleryData[serviceName] || [];


    currentIndex = 0;


    if (galleryTitle) {

        galleryTitle.textContent =
            serviceName;

    }


    if (!currentGallery.length) {

        if (galleryThumbnails) {

            galleryThumbnails.innerHTML = `

                <div style="
                    width:100%;
                    text-align:center;
                    padding:30px;
                    opacity:0.7;
                ">

                    No photos available.

                </div>

            `;

        }

    } else {

        renderGallery();

    }


    if (galleryModal) {

        galleryModal.classList.add(
            "active"
        );

    }


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   11. RENDER GALLERY
========================================================= */

function renderGallery() {

    if (!currentGallery.length) {

        return;

    }


    const rawItem =
        currentGallery[currentIndex];


    const item =
        typeof rawItem === "string"

            ? {
                type: "image",
                src: rawItem
            }

            : rawItem;


    if (
        !galleryMainImage ||
        !galleryMainVideo
    ) {

        console.error(
            "Gallery media elements missing."
        );

        return;

    }


    /* HIDE BOTH */

    galleryMainImage.style.display =
        "none";

    galleryMainVideo.style.display =
        "none";


    galleryMainVideo.pause();

    galleryMainVideo.removeAttribute(
        "src"
    );

    galleryMainVideo.load();


    /* =====================================================
       IMAGE
    ===================================================== */

    if (item.type === "image") {

        galleryMainImage.style.display =
            "block";


        galleryMainImage.classList.remove(
            "gallery-enter"
        );


        galleryMainImage.style.opacity =
            "0";


        setTimeout(() => {

            galleryMainImage.src =
                item.src;


            galleryMainImage.style.opacity =
                "1";


            void galleryMainImage.offsetWidth;


            galleryMainImage.classList.add(
                "gallery-enter"
            );

        }, 120);

    }


    /* =====================================================
       VIDEO
    ===================================================== */

    else if (item.type === "video") {

        galleryMainVideo.style.display =
            "block";


        galleryMainVideo.src =
            item.src;


        galleryMainVideo.load();


        galleryMainVideo.classList.remove(
            "gallery-enter"
        );


        void galleryMainVideo.offsetWidth;


        galleryMainVideo.classList.add(
            "gallery-enter"
        );


        galleryMainVideo.play()
            .catch(() => {

                console.log(
                    "Video requires user interaction."
                );

            });

    }


    /* =====================================================
       COUNTER
    ===================================================== */

    if (galleryCounter) {

        galleryCounter.textContent =

            `${String(
                currentIndex + 1
            ).padStart(2, "0")} / ${String(
                currentGallery.length
            ).padStart(2, "0")}`;

    }


    /* =====================================================
       THUMBNAILS
    ===================================================== */

    if (!galleryThumbnails) {

        return;

    }


    galleryThumbnails.innerHTML = "";


    currentGallery.forEach(
        (galleryItem, index) => {

            const thumbnail =
                document.createElement(
                    "button"
                );


            thumbnail.className =
                "gallery-thumb";


            if (
                index === currentIndex
            ) {

                thumbnail.classList.add(
                    "active"
                );

            }


            /* IMAGE STRING */

            if (
                typeof galleryItem ===
                "string"
            ) {

                thumbnail.innerHTML = `

                    <img
                        src="${galleryItem}"
                        alt="Gallery image ${index + 1}"
                        loading="lazy"
                    >

                `;

            }


            /* IMAGE OBJECT */

            else if (
                galleryItem.type ===
                "image"
            ) {

                thumbnail.innerHTML = `

                    <img
                        src="${galleryItem.src}"
                        alt="Gallery image ${index + 1}"
                        loading="lazy"
                    >

                `;

            }


            /* VIDEO */

            else if (
                galleryItem.type ===
                "video"
            ) {

                thumbnail.innerHTML = `

                    <div class="video-thumbnail">

                        <i class="fa-solid fa-play"></i>

                        <span>
                            VIDEO
                        </span>

                    </div>

                `;

            }


            thumbnail.addEventListener(
                "click",
                () => {

                    currentIndex =
                        index;

                    renderGallery();

                }
            );


            galleryThumbnails.appendChild(
                thumbnail
            );

        }
    );

}


/* =========================================================
   12. NEXT IMAGE
========================================================= */

function nextImage() {

    if (!currentGallery.length) {

        return;

    }


    currentIndex++;


    if (
        currentIndex >=
        currentGallery.length
    ) {

        currentIndex = 0;

    }


    renderGallery();

}


/* =========================================================
   13. PREVIOUS IMAGE
========================================================= */

function previousImage() {

    if (!currentGallery.length) {

        return;

    }


    currentIndex--;


    if (currentIndex < 0) {

        currentIndex =
            currentGallery.length - 1;

    }


    renderGallery();

}


/* =========================================================
   14. GALLERY BUTTONS
========================================================= */

if (galleryNext) {

    galleryNext.addEventListener(
        "click",
        nextImage
    );

}


if (galleryPrev) {

    galleryPrev.addEventListener(
        "click",
        previousImage
    );

}


/* =========================================================
   15. CLOSE GALLERY
========================================================= */

function closeGallery() {

    if (galleryModal) {

        galleryModal.classList.remove(
            "active"
        );

    }


    document.body.classList.remove(
        "modal-open"
    );


    if (galleryMainVideo) {

        galleryMainVideo.pause();

    }

}


if (galleryClose) {

    galleryClose.addEventListener(
        "click",
        closeGallery
    );

}


if (galleryOverlay) {

    galleryOverlay.addEventListener(
        "click",
        closeGallery
    );

}


/* =========================================================
   16. KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            !galleryModal ||
            !galleryModal.classList.contains(
                "active"
            )
        ) {

            return;

        }


        if (event.key === "Escape") {

            closeGallery();

        }


        if (event.key === "ArrowRight") {

            nextImage();

        }


        if (event.key === "ArrowLeft") {

            previousImage();

        }

    }
);


/* =========================================================
   17. TOUCH / SWIPE
========================================================= */

let touchStartX = 0;

let touchEndX = 0;


if (galleryMainImage) {

    galleryMainImage.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        }
    );


    galleryMainImage.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0]
                    .screenX;

            handleSwipe();

        }
    );

}


function handleSwipe() {

    const distance =
        touchEndX - touchStartX;


    if (
        Math.abs(distance) < 50
    ) {

        return;

    }


    if (distance < 0) {

        nextImage();

    } else {

        previousImage();

    }

}


/* =========================================================
   18. SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(

        ".service-card, " +
        ".why-card, " +
        ".contact-card, " +
        ".about-content, " +
        ".about-image"

    );


if (
    "IntersectionObserver"
    in window
) {

    const revealObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";


                            entry.target.style.transform =
                                "translateY(0)";


                            revealObserver
                                .unobserve(
                                    entry.target
                                );

                        }

                    }
                );

            },

            {
                threshold: 0.08
            }

        );


    revealElements.forEach(
        element => {

            element.style.opacity =
                "0";


            element.style.transform =
                "translateY(25px)";


            element.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";


            revealObserver.observe(
                element
            );

        }
    );

}


/* =========================================================
   19. BROKEN IMAGE PROTECTION
========================================================= */

if (galleryMainImage) {

    galleryMainImage.addEventListener(
        "error",
        () => {

            galleryMainImage.alt =
                "Gallery image unavailable";

        }
    );

}


/* =========================================================
   20. SPACE PARTICLES
========================================================= */

const particleContainer =
    document.querySelector(
        ".space-particles"
    );


if (particleContainer) {

    const particleCount =
        window.innerWidth <= 768
            ? 18
            : 35;


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "space-particle";


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${Math.random() * 100}%`;


        particle.style.setProperty(
            "--particle-x",
            `${(
                Math.random() - 0.5
            ) * 100}px`
        );


        particle.style.setProperty(
            "--particle-y",
            `${(
                Math.random() - 0.5
            ) * 100}px`
        );


        particle.style.setProperty(
            "--particle-duration",
            `${5 + Math.random() * 8}s`
        );


        particle.style.setProperty(
            "--particle-opacity",
            `${0.25 + Math.random() * 0.5}`
        );


        particle.style.animationDelay =
            `${Math.random() * 6}s`;


        particleContainer.appendChild(
            particle
        );

    }

}


/* =========================================================
   21. GALLERY IMAGE ANIMATION
========================================================= */

function animateGalleryImage() {

    if (!galleryMainImage) {

        return;

    }


    galleryMainImage.classList.remove(
        "gallery-enter"
    );


    void galleryMainImage.offsetWidth;


    galleryMainImage.classList.add(
        "gallery-enter"
    );

}


window.renderGalleryWithAnimation =
    function () {

        renderGallery();


        setTimeout(
            () => {

                animateGalleryImage();

            },
            120
        );

    };


/* =========================================================
   22. HERO FLOATING CARDS
========================================================= */

const floatingCards =
    document.querySelectorAll(
        ".floating-card"
    );


floatingCards.forEach(
    (card, index) => {

        card.style.animationDelay =
            `${index * -1.8}s`;

    }
);


/* =========================================================
   IMPORTANT:
   HERO 3D MOUSE TILT REMOVED
   HERO MOUSE GLOW REMOVED
========================================================= */


/* =========================================================
   23. PREMIUM OPENING ANIMATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const intro =
            document.getElementById(
                "asomi-intro"
            );


        const particleContainer =
            document.getElementById(
                "asomiParticles"
            );


        /* =================================================
           CREATE INTRO PARTICLES
        ================================================= */

        if (particleContainer) {

            const particleCount =
                window.innerWidth <= 768
                    ? 35
                    : 80;


            for (
                let i = 0;
                i < particleCount;
                i++
            ) {

                const particle =
                    document.createElement(
                        "span"
                    );


                particle.className =
                    "asomi-particle";


                particle.style.left =
                    `${Math.random() * 100}%`;


                particle.style.top =
                    `${Math.random() * 100}%`;


                const size =
                    Math.random() * 3 + 1;


                particle.style.width =
                    `${size}px`;


                particle.style.height =
                    `${size}px`;


                particle.style.setProperty(
                    "--particle-x",
                    `${(
                        Math.random() - 0.5
                    ) * 350}px`
                );


                particle.style.setProperty(
                    "--particle-time",
                    `${4 + Math.random() * 6}s`
                );


                particle.style.animationDelay =
                    `${Math.random() * 5}s`;


                particleContainer.appendChild(
                    particle
                );

            }

        }


        /* =================================================
           PAGE LOCK
        ================================================= */

        document.body.style.overflow =
            "hidden";


        /* =================================================
           FINISH INTRO
        ================================================= */

        setTimeout(
            () => {

                if (!intro) {

                    document.body.style.overflow =
                        "";

                    return;

                }


                intro.classList.add(
                    "asomi-intro-hide"
                );


                document.body.style.overflow =
                    "";

            },
            7000
        );


        /* =================================================
           CLICK TO SKIP
        ================================================= */

        if (intro) {

            intro.addEventListener(
                "click",
                () => {

                    intro.classList.add(
                        "asomi-intro-hide"
                    );


                    document.body.style.overflow =
                        "";

                }
            );

        }

    }
);


/* =========================================================
   24. FINAL CONSOLE MESSAGE
========================================================= */

console.log(
    "%cASOMI ENTERPRISE",
    "font-size:24px;font-weight:bold;"
);


console.log(
    "Premium Printing Services • Guwahati"
);


console.log(
    "Mouse / Cursor animations disabled."
);
