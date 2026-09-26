/* =========================================================
   ASOMI ENTERPRISE
   COMPLETE WEBSITE JAVASCRIPT
========================================================= */


/* =========================================================
   1. MOBILE NAVIGATION
========================================================= */

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

if (menuButton && nav) {

    menuButton.addEventListener("click", () => {

        nav.classList.toggle("open");

        const icon = menuButton.querySelector("i");

        if (!icon) return;

        if (nav.classList.contains("open")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });


    /* CLOSE MOBILE MENU AFTER CLICK */

    document.querySelectorAll(".nav-link").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

            const icon = menuButton.querySelector("i");

            if (!icon) return;

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        });

    });

}


/* =========================================================
   2. HEADER SCROLL EFFECT
========================================================= */

const header = document.getElementById("header");

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
            window.scrollY < sectionTop + sectionHeight
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
   EXISTING LOCAL PHOTOS + SUPABASE PHOTOS
========================================================= */


/*
   IMPORTANT:

   Existing local photos are NOT removed.

   Supabase photos will be added AFTER
   the existing local photos.
*/


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
   SUPABASE
========================================================= */

let supabaseClient = null;


/*
   Create Supabase client only if
   configuration is available.
*/

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
   SERVICE NAMES
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
   LOAD SUPABASE PHOTOS
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
        const serviceName
        of supabaseServiceNames
    ) {

        try {

            const {
                data,
                error
            } = await supabaseClient.storage
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


            if (!data || data.length === 0) {

                continue;

            }


            data.forEach(file => {

                /*
                   Ignore placeholder files
                */

                if (
                    !file.name ||
                    file.name ===
                    ".emptyFolderPlaceholder"
                ) {

                    return;

                }


                /*
                   Only images
                */

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
                    !allowedExtensions.includes(
                        extension
                    )
                ) {

                    return;

                }


                /*
                   Full Supabase path
                */

                const filePath =
                    `${serviceName}/${file.name}`;


                /*
                   Generate public URL
                */

                const {
                    data: publicData
                } = supabaseClient.storage
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


/*
   Promise allows gallery clicks to wait
   until Supabase photos are loaded.
*/

const supabasePhotosReady =
    loadSupabasePhotos();


/* =========================================================
   5. GALLERY ELEMENTS
========================================================= */

const galleryModal =
    document.getElementById("galleryModal");

const galleryClose =
    document.getElementById("galleryClose");

const galleryOverlay =
    document.getElementById("galleryOverlay");

const galleryTitle =
    document.getElementById("galleryTitle");

const galleryCounter =
    document.getElementById("galleryCounter");

const galleryMainImage =
    document.getElementById("galleryMainImage");

const galleryMainVideo =
    document.getElementById("galleryMainVideo");

const galleryThumbnails =
    document.getElementById("galleryThumbnails");

const galleryPrev =
    document.getElementById("galleryPrev");

const galleryNext =
    document.getElementById("galleryNext");


let currentGallery = [];
let currentIndex = 0;


/* =========================================================
   6. OPEN GALLERY
========================================================= */

document.querySelectorAll(".service-card").forEach(card => {

    card.addEventListener("click", () => {

        const serviceName =
            card.dataset.service;

        openGallery(serviceName);

    });

});


async function openGallery(serviceName) {

    /*
       Wait until Supabase photos have loaded.
    */

    try {

        await supabasePhotosReady;

    } catch (error) {

        console.error(
            "Supabase gallery loading error:",
            error
        );

    }


    /*
       Get existing + Supabase photos
    */

    currentGallery =
        galleryData[serviceName] || [];


    currentIndex = 0;


    if (galleryTitle) {

        galleryTitle.textContent =
            serviceName;

    }


    /*
       Open gallery even if there are
       no Supabase photos.
    */

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
   7. RENDER GALLERY
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


    if (!galleryMainImage ||
        !galleryMainVideo) {

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


        galleryMainVideo.play().catch(() => {

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
            `${String(currentIndex + 1).padStart(2, "0")} / ${String(currentGallery.length).padStart(2, "0")}`;

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
                document.createElement("button");


            thumbnail.className =
                "gallery-thumb";


            if (index === currentIndex) {

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
                        <span>VIDEO</span>
                    </div>
                `;

            }


            /* THUMBNAIL CLICK */

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
   8. NEXT IMAGE
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
   9. PREVIOUS IMAGE
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
   10. GALLERY BUTTONS
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
   11. CLOSE GALLERY
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
   12. KEYBOARD CONTROLS
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
   13. TOUCH / SWIPE
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


    if (Math.abs(distance) < 50) {
        return;
    }


    if (distance < 0) {

        nextImage();

    } else {

        previousImage();

    }

}


/* =========================================================
   14. SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".service-card, .why-card, .contact-card, .about-content, .about-image"
    );


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";


                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.08
            }
        );


    revealElements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(25px)";

        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";


        revealObserver.observe(
            element
        );

    });

}


/* =========================================================
   15. BROKEN IMAGE PROTECTION
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
   16. MOUSE FOLLOW BACKGROUND
========================================================= */

const root =
    document.documentElement;


let mouseTargetX =
    window.innerWidth / 2;

let mouseTargetY =
    window.innerHeight / 2;


let mouseCurrentX =
    mouseTargetX;

let mouseCurrentY =
    mouseTargetY;


document.addEventListener(
    "mousemove",
    event => {

        mouseTargetX =
            event.clientX;

        mouseTargetY =
            event.clientY;

    }
);


function animateMouseBackground() {

    mouseCurrentX +=
        (mouseTargetX - mouseCurrentX) *
        0.08;


    mouseCurrentY +=
        (mouseTargetY - mouseCurrentY) *
        0.08;


    root.style.setProperty(
        "--mouse-x",
        `${mouseCurrentX}px`
    );


    root.style.setProperty(
        "--mouse-y",
        `${mouseCurrentY}px`
    );


    requestAnimationFrame(
        animateMouseBackground
    );

}


animateMouseBackground();


/* =========================================================
   17. SPACE PARTICLES
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
            document.createElement("span");


        particle.className =
            "space-particle";


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.top =
            `${Math.random() * 100}%`;


        particle.style.setProperty(
            "--particle-x",
            `${(Math.random() - 0.5) * 100}px`
        );


        particle.style.setProperty(
            "--particle-y",
            `${(Math.random() - 0.5) * 100}px`
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
   18. GALLERY IMAGE ANIMATION
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
   19. PREMIUM HERO 3D TILT
========================================================= */

const heroVisual =
    document.querySelector(
        ".hero-visual"
    );

const heroCard =
    document.querySelector(
        ".hero-card"
    );


if (
    heroVisual &&
    heroCard &&
    window.matchMedia(
        "(min-width: 769px)"
    ).matches
) {

    let heroTargetX = 0;
    let heroTargetY = 0;

    let heroCurrentX = 0;
    let heroCurrentY = 0;


    heroVisual.addEventListener(
        "mousemove",
        event => {

            const rect =
                heroVisual.getBoundingClientRect();


            const x =
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width;


            const y =
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height;


            heroTargetX =
                (x - 0.5) * 10;


            heroTargetY =
                (y - 0.5) * -10;

        }
    );


    heroVisual.addEventListener(
        "mouseleave",
        () => {

            heroTargetX = 0;
            heroTargetY = 0;

        }
    );


    function animateHeroCard() {

        heroCurrentX +=
            (
                heroTargetX -
                heroCurrentX
            ) * 0.08;


        heroCurrentY +=
            (
                heroTargetY -
                heroCurrentY
            ) * 0.08;


        heroCard.style.setProperty(
            "--hero-rotate-x",
            `${heroCurrentY}deg`
        );


        heroCard.style.setProperty(
            "--hero-rotate-y",
            `${heroCurrentX}deg`
        );


        heroCard.style.transform =
            `
            rotateX(${heroCurrentY}deg)
            rotateY(${heroCurrentX}deg)
            rotate(2deg)
            translateY(-4px)
            `;


        requestAnimationFrame(
            animateHeroCard
        );

    }


    animateHeroCard();

}


/* =========================================================
   20. HERO FLOATING CARDS
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
   21. HERO CARD MOUSE GLOW
========================================================= */

if (heroVisual && heroCard) {

    heroVisual.addEventListener(
        "mousemove",
        event => {

            const rect =
                heroCard.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            heroCard.style.setProperty(
                "--hero-glow-x",
                `${x}px`
            );


            heroCard.style.setProperty(
                "--hero-glow-y",
                `${y}px`
            );

        }
    );

}


/* =========================================================
   22. CURSOR SPARKLE
========================================================= */

(() => {

    if (
        window.matchMedia(
            "(max-width: 768px)"
        ).matches
    ) {

        return;

    }


    const cursor =
        document.getElementById(
            "customCursor"
        );


    const sparkleContainer =
        document.getElementById(
            "cursorSparkleContainer"
        );


    if (
        !cursor ||
        !sparkleContainer
    ) {

        return;

    }


    let mouseX =
        window.innerWidth / 2;

    let mouseY =
        window.innerHeight / 2;


    let currentX =
        mouseX;

    let currentY =
        mouseY;


    let lastSparkX =
        mouseX;

    let lastSparkY =
        mouseY;


    let mouseMoving =
        false;


    document.addEventListener(
        "mousemove",
        event => {

            mouseX =
                event.clientX;

            mouseY =
                event.clientY;

            mouseMoving =
                true;

        }
    );


    function animateCursor() {

        currentX +=
            (mouseX - currentX) *
            0.22;


        currentY +=
            (mouseY - currentY) *
            0.22;


        const dx =
            currentX -
            lastSparkX;


        const dy =
            currentY -
            lastSparkY;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            mouseMoving &&
            distance > 7
        ) {

            createSpark(
                currentX,
                currentY,
                dx,
                dy
            );


            lastSparkX =
                currentX;

            lastSparkY =
                currentY;

        }


        mouseMoving =
            false;


        requestAnimationFrame(
            animateCursor
        );

    }


    animateCursor();


    function createSpark(
        x,
        y,
        directionX,
        directionY
    ) {

        const spark =
            document.createElement(
                "span"
            );


        spark.className =
            "cursor-spark";


        const size =
            2 +
            Math.random() * 4;


        const life =
            450 +
            Math.random() * 350;


        const spread =
            8 +
            Math.random() * 18;


        const randomX =
            (
                Math.random() -
                0.5
            ) * spread;


        const randomY =
            (
                Math.random() -
                0.5
            ) * spread;


        const driftX =
            -directionX * 0.45 +
            randomX;


        const driftY =
            -directionY * 0.45 +
            randomY;


        spark.style.setProperty(
            "--spark-x",
            `${x}px`
        );


        spark.style.setProperty(
            "--spark-y",
            `${y}px`
        );


        spark.style.setProperty(
            "--spark-size",
            `${size}px`
        );


        spark.style.setProperty(
            "--spark-life",
            `${life}ms`
        );


        spark.style.setProperty(
            "--spark-dx",
            `${driftX}px`
        );


        spark.style.setProperty(
            "--spark-dy",
            `${driftY}px`
        );


        sparkleContainer.appendChild(
            spark
        );


        setTimeout(
            () => {

                spark.remove();

            },
            life + 50
        );

    }


    /* =====================================================
       HOVER EFFECT
    ===================================================== */

    const hoverElements =
        document.querySelectorAll(
            "a, button, .service-card, .nav-link, .btn"
        );


    hoverElements.forEach(
        element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursor.classList.add(
                        "cursor-hover"
                    );

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    cursor.classList.remove(
                        "cursor-hover"
                    );

                }
            );

        }
    );


    /* =====================================================
       CLICK BURST
    ===================================================== */

    document.addEventListener(
        "click",
        event => {

            createClickBurst(
                event.clientX,
                event.clientY
            );

        }
    );


    function createClickBurst(
        x,
        y
    ) {

        const particleCount =
            12;


        for (
            let i = 0;
            i < particleCount;
            i++
        ) {

            const burst =
                document.createElement(
                    "span"
                );


            burst.className =
                "cursor-burst";


            const angle =
                (
                    Math.PI * 2 /
                    particleCount
                ) * i;


            const distance =
                20 +
                Math.random() * 28;


            const burstX =
                Math.cos(angle) *
                distance;


            const burstY =
                Math.sin(angle) *
                distance;


            burst.style.left =
                `${x}px`;


            burst.style.top =
                `${y}px`;


            burst.style.setProperty(
                "--burst-x",
                `${burstX}px`
            );


            burst.style.setProperty(
                "--burst-y",
                `${burstY}px`
            );


            sparkleContainer.appendChild(
                burst
            );


            setTimeout(
                () => {

                    burst.remove();

                },
                700
            );

        }

    }

})();


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
           CREATE GOLD PARTICLES
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
                    Math.random() * 3 +
                    1;


                particle.style.width =
                    `${size}px`;


                particle.style.height =
                    `${size}px`;


                particle.style.setProperty(
                    "--particle-x",
                    `${(
                        Math.random() -
                        0.5
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
    "Hero 3D interaction enabled."
);
<script>

/* =========================================================
   🔥 ASOMI ENTERPRISE — PLASMA CURSOR ENGINE
   ========================================================= */

(function () {

    const canvas = document.getElementById("plasmaCanvas");
    const cursor = document.querySelector(".plasma-cursor");

    if (!canvas || !cursor) {
        console.error("PLASMA CURSOR: elements not found");
        return;
    }

    const ctx = canvas.getContext("2d");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let x = mouseX;
    let y = mouseY;

    let oldX = x;
    let oldY = y;

    const trail = [];

    const TRAIL_LENGTH = 55;


    /* =====================================================
       CANVAS
       ===================================================== */

    function resize() {

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width =
            window.innerWidth * dpr;

        canvas.height =
            window.innerHeight * dpr;

        canvas.style.width =
            window.innerWidth + "px";

        canvas.style.height =
            window.innerHeight + "px";

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }

    resize();

    window.addEventListener("resize", resize);


    /* =====================================================
       MOUSE
       ===================================================== */

    window.addEventListener(
        "mousemove",
        function (e) {

            mouseX = e.clientX;
            mouseY = e.clientY;

        },
        { passive: true }
    );


    /* =====================================================
       PARTICLES
       ===================================================== */

    function particle(px, py) {

        const p =
            document.createElement("div");

        p.className =
            "plasma-particle";

        p.style.left =
            px + "px";

        p.style.top =
            py + "px";

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            15 + Math.random() * 45;

        p.style.setProperty(
            "--particle-x",
            Math.cos(angle) * distance + "px"
        );

        p.style.setProperty(
            "--particle-y",
            Math.sin(angle) * distance + "px"
        );

        document.body.appendChild(p);

        setTimeout(
            () => p.remove(),
            850
        );
    }


    /* =====================================================
       CLICK
       ===================================================== */

    window.addEventListener(
        "mousedown",
        function (e) {

            const burst =
                document.createElement("div");

            burst.className =
                "plasma-burst";

            burst.style.left =
                e.clientX + "px";

            burst.style.top =
                e.clientY + "px";

            document.body.appendChild(burst);

            setTimeout(
                () => burst.remove(),
                750
            );

        }
    );


    /* =====================================================
       DRAW
       ===================================================== */

    function animate() {

        requestAnimationFrame(animate);


        /* Smooth mouse */

        x +=
            (mouseX - x) * 0.20;

        y +=
            (mouseY - y) * 0.20;


        /* Cursor */

        cursor.style.transform =
            `translate3d(${x}px, ${y}px, 0)
             translate(-50%, -50%)`;


        /* Trail point */

        trail.push({
            x: x,
            y: y,
            time: performance.now()
        });


        if (trail.length > TRAIL_LENGTH) {
            trail.shift();
        }


        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        if (trail.length < 3) {
            return;
        }


        /* =================================================
           PLASMA RIBBON
           ================================================= */

        for (
            let layer = 0;
            layer < 4;
            layer++
        ) {

            ctx.beginPath();

            for (
                let i = 0;
                i < trail.length;
                i++
            ) {

                const p =
                    trail[i];

                const progress =
                    i / trail.length;

                const wave =
                    Math.sin(
                        i * .42 +
                        performance.now() * .004
                    )
                    *
                    (
                        3 +
                        layer * 2
                    );

                const px =
                    p.x + wave;

                const py =
                    p.y +
                    Math.cos(
                        i * .35 +
                        performance.now() * .003
                    )
                    *
                    (
                        layer * 2
                    );


                if (i === 0) {

                    ctx.moveTo(
                        px,
                        py
                    );

                } else {

                    ctx.lineTo(
                        px,
                        py
                    );

                }

            }


            /* Gradient */

            const gradient =
                ctx.createLinearGradient(
                    trail[0].x,
                    trail[0].y,
                    x,
                    y
                );


            gradient.addColorStop(
                0,
                "rgba(45,30,255,0)"
            );

            gradient.addColorStop(
                .20,
                "rgba(75,40,255,.10)"
            );

            gradient.addColorStop(
                .50,
                "rgba(40,120,255,.35)"
            );

            gradient.addColorStop(
                .75,
                "rgba(50,220,255,.70)"
            );

            gradient.addColorStop(
                1,
                "rgba(255,255,255,.98)"
            );


            ctx.strokeStyle =
                gradient;


            ctx.lineWidth =
                25 -
                layer * 5;


            ctx.lineCap =
                "round";

            ctx.lineJoin =
                "round";


            ctx.shadowBlur =
                25 +
                layer * 12;


            ctx.shadowColor =
                "rgba(35,150,255,.9)";


            ctx.globalAlpha =
                .20 +
                layer * .18;


            ctx.stroke();

        }


        /* =================================================
           WHITE HOT CORE
           ================================================= */

        ctx.beginPath();

        ctx.moveTo(
            trail[0].x,
            trail[0].y
        );

        for (
            let i = 1;
            i < trail.length;
            i++
        ) {

            ctx.lineTo(
                trail[i].x,
                trail[i].y
            );

        }


        ctx.strokeStyle =
            "rgba(255,255,255,.75)";

        ctx.lineWidth =
            5;

        ctx.shadowBlur =
            20;

        ctx.shadowColor =
            "#ffffff";

        ctx.globalAlpha =
            .8;

        ctx.stroke();


        ctx.globalAlpha =
            1;


        /* =================================================
           PARTICLES
           ================================================= */

        const dx =
            x - oldX;

        const dy =
            y - oldY;

        const speed =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            speed > 2 &&
            Math.random() < .75
        ) {

            particle(
                x,
                y
            );

        }


        oldX = x;
        oldY = y;

    }


    animate();


    console.log(
        "🔥 ASOMI PLASMA CURSOR ACTIVE"
    );

})();

</script>
/* =========================================================
   ASOMI INTRO — FORCE EXIT FIX
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const intro = document.getElementById("asomi-intro");

    if (!intro) return;

    console.log("ASOMI INTRO FOUND");

    setTimeout(() => {

        intro.classList.add("asomi-intro-hide");

        console.log("ASOMI INTRO HIDDEN");

    }, 6500);

});
