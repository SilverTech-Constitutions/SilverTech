document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight / 5 * 4;
        revealElements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < triggerBottom) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // Dynamic Image Loading
    const images = {
        'owner-img': 'IMG-20231121-WA0016 2.jpg',
        'manager-img': 'DSC04933.JPG'
    };

    Object.keys(images).forEach(id => {
        const img = document.getElementById(id);
        if (img) {
            img.src = images[id];
            img.onerror = () => {
                console.error(`Failed to load image: ${id}`);
                img.style.display = 'none';
                img.parentElement.style.backgroundColor = '#1a1a1a';
                img.parentElement.innerHTML += '<i class="fas fa-user-tie" style="font-size: 2rem; opacity: 0.3;"></i>';
            };
        }
    });

    // Butterfly Spawning Logic
    const butterflyContainer = document.getElementById('butterfly-container');
    if (butterflyContainer) {
        const title = document.querySelector('.archon-title');

        function spawnButterfliesLocal(e) {
            // Prevent spamming too many
            if (document.querySelectorAll('.butterfly').length > 50) return;

            const rect = title.getBoundingClientRect();
            // Spawn a batch
            for (let i = 0; i < 5; i++) {
                createButterflyOut(rect);
            }
        }

        function createButterflyOut(rect) {
            const butterfly = document.createElement('div');
            butterfly.className = 'butterfly';
            if (Math.random() > 0.5) {
                butterfly.classList.add('blue');
            }

            // Realism: Wobble wrapper and Body
            const wobbleWrapper = document.createElement('div');
            wobbleWrapper.className = 'wobble-wrapper';

            const body = document.createElement('div');
            body.className = 'body';

            const leftWing = document.createElement('div');
            leftWing.className = 'wing left-wing';
            const rightWing = document.createElement('div');
            rightWing.className = 'wing right-wing';

            wobbleWrapper.appendChild(body);
            wobbleWrapper.appendChild(leftWing);
            wobbleWrapper.appendChild(rightWing);
            butterfly.appendChild(wobbleWrapper);

            butterflyContainer.appendChild(butterfly);

            // Randomize Size & Speed
            const scale = 0.3 + Math.random() * 0.5;
            butterfly.style.setProperty('--scale', scale);

            const flapSpeed = 0.1 + Math.random() * 0.15;
            leftWing.style.animationDuration = `${flapSpeed}s`;
            rightWing.style.animationDuration = `${flapSpeed}s`;

            // Wobble
            butterfly.style.setProperty('--wobble-duration', `${2 + Math.random() * 2}s`);
            butterfly.style.setProperty('--w-rx', `${5 + Math.random() * 10}deg`);
            butterfly.style.setProperty('--w-ry', `${5 + Math.random() * 10}deg`);
            butterfly.style.setProperty('--w-tx', `${2 + Math.random() * 4}px`);
            butterfly.style.setProperty('--w-ty', `${2 + Math.random() * 4}px`);

            // Start Position: Random point within the title
            const startX = rect.left + Math.random() * rect.width;
            const startY = rect.top + Math.random() * rect.height;

            // End Position: Random point off-screen
            const angle = Math.random() * 2 * Math.PI; // Random direction
            const distance = Math.max(window.innerWidth, window.innerHeight) * (0.8 + Math.random() * 0.5);
            const endX = startX + Math.cos(angle) * distance;
            const endY = startY + Math.sin(angle) * distance;

            // Set CSS Variables
            butterfly.style.setProperty('--sx', `${startX}px`);
            butterfly.style.setProperty('--sy', `${startY}px`);
            butterfly.style.setProperty('--sz', '0px');

            butterfly.style.setProperty('--ex', `${endX}px`);
            butterfly.style.setProperty('--ey', `${endY}px`);
            butterfly.style.setProperty('--ez', `${(Math.random() - 0.5) * 500}px`);

            // Rotations
            const rotationZ = (angle * 180 / Math.PI) + 90; // Align to direction
            butterfly.style.setProperty('--rz', `${rotationZ}deg`);
            butterfly.style.setProperty('--erz', `${rotationZ + (Math.random() - 0.5) * 60}deg`);

            butterfly.style.setProperty('--frx', `${Math.random() * 60}deg`);
            butterfly.style.setProperty('--fry', `${Math.random() * 60}deg`);
            butterfly.style.setProperty('--erx', `${Math.random() * 360}deg`);
            butterfly.style.setProperty('--ery', `${Math.random() * 360}deg`);

            const duration = 2 + Math.random() * 3;
            butterfly.style.animation = `fly-out-burst ${duration}s forwards ease-in`;

            // Cleanup
            setTimeout(() => {
                butterfly.remove();
            }, duration * 1000);
        }

        // Add Listeners
        if (title) {
            title.style.cursor = 'pointer';
            title.addEventListener('click', spawnButterfliesLocal);
            title.addEventListener('mouseover', spawnButterfliesLocal); // Also trigger on hover for similar feel
            title.addEventListener('touchstart', spawnButterfliesLocal, { passive: true });
        }
    }

    // Dynamic IST Clock
    const clockElement = document.getElementById('ist-clock');
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

            let hours = istTime.getHours();
            const minutes = istTime.getMinutes().toString().padStart(2, '0');
            const seconds = istTime.getSeconds().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';

            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'

            clockElement.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

            // Open/Closed Logic (Mon-Sat, 9 AM - 6 PM IST)
            const day = istTime.getDay(); // 0 = Sunday
            const currentHourIn24 = istTime.getHours();

            // Re-select element here inside the function to be safe or use global ID
            const statusElement = document.getElementById('shop-status');

            if (statusElement) {
                let isOpen = false;
                if (day !== 0) { // Not Sunday
                    if (currentHourIn24 >= 9 && currentHourIn24 < 18) {
                        isOpen = true;
                    }
                }

                if (isOpen) {
                    statusElement.textContent = 'Open Now';
                    statusElement.className = 'status-indicator open';
                } else {
                    statusElement.textContent = 'Closed Now';
                    statusElement.className = 'status-indicator closed';
                }
            }
        }

        setInterval(updateClock, 1000);
        updateClock(); // Initial call
    }

    // Happy Customers Gallery Logic
    const btnViewMore = document.getElementById('btn-view-more');
    if (btnViewMore) {
        btnViewMore.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.media-item.hidden');
            hiddenItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.remove('hidden');
                    // Trigger reveal for newly shown items
                    item.classList.add('active');
                }, index * 100);
            });
            btnViewMore.style.display = 'none';
        });
    }

    // Media Modal Logic
    const modal = document.getElementById('media-modal');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('media-close');

    if (modal && modalBody && modalClose) {
        const mediaGallery = document.getElementById('media-gallery');
        if (mediaGallery) {
            mediaGallery.addEventListener('click', (e) => {
                const item = e.target.closest('.media-item');
                if (!item) return;

                const img = item.querySelector('img');
                const video = item.querySelector('video');

                modalBody.innerHTML = '';

                if (img) {
                    const fullImg = document.createElement('img');
                    fullImg.src = img.src;
                    modalBody.appendChild(fullImg);
                } else if (video) {
                    const fullVideo = document.createElement('video');
                    const source = video.querySelector('source');
                    fullVideo.src = source ? source.src : video.src;
                    fullVideo.controls = true;
                    fullVideo.autoplay = true;
                    modalBody.appendChild(fullVideo);
                }

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scroll
            });
        }

        const closeModal = () => {
            modal.classList.remove('active');
            modalBody.innerHTML = ''; // Stop video playback
            document.body.style.overflow = 'auto';
        };

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // --- Persistence & Shared Gallery (Firebase) ---
    const firebaseConfig = {
        apiKey: "AIzaSyAvbrm2DiErUE_Bgs-bIqj5ykmhFMXzGEM",
        authDomain: "silvertech-c5750.firebaseapp.com",
        projectId: "silvertech-c5750",
        storageBucket: "silvertech-c5750.firebasestorage.app",
        messagingSenderId: "386756975726",
        appId: "1:386756975726:web:84ae4d88d75dda440b1a7f",
        measurementId: "G-4JKBVZGFXT"
    };

    let db = null;
    let storage = null;
    const isFirebaseReady = firebaseConfig.apiKey !== "";

    if (isFirebaseReady) {
        try {
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            storage = firebase.storage();
            console.log("Firebase initialized successfully.");

            // Connection Test with UI Feedback
            const checkFirebaseConnection = async () => {
                const statusEl = document.getElementById('firebase-status');
                try {
                    // Test Firestore (Write permission check)
                    await db.collection('connection_test').doc('ping').set({
                        last_check: new Date(),
                        client: 'browser'
                    });

                    if (statusEl) {
                        statusEl.innerHTML = '<i class="fas fa-check-circle" style="color: #62ff24;"></i> Cloud Connection: Active';
                        statusEl.style.opacity = "0.8";
                    }
                    console.log("Firestore Connection: OK");
                } catch (error) {
                    console.error("Firebase Connection Issue:", error);
                    if (statusEl) {
                        statusEl.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: #ff3e3e;"></i> Cloud Offline: Check Security Rules';
                        statusEl.style.opacity = "1";
                    }
                }
            };
            checkFirebaseConnection();
        } catch (error) {
            console.error("Firebase initialization failed:", error);
        }
    }


    // --- Preview & Delete Logic ---
    const previewModal = document.getElementById('preview-modal');
    const previewBody = document.getElementById('preview-body');
    const previewClose = document.getElementById('preview-close');
    const btnConfirmUpload = document.getElementById('btn-confirm-upload');
    const btnCancelUpload = document.getElementById('btn-cancel-upload');

    let currentFileToUpload = null;

    const closePreview = () => {
        previewModal.classList.remove('active');
        previewBody.innerHTML = '';
        currentFileToUpload = null;
        document.body.style.overflow = 'auto';
    };

    if (previewClose) previewClose.addEventListener('click', closePreview);
    if (btnCancelUpload) btnCancelUpload.addEventListener('click', closePreview);

    // Delete Logic
    const deleteMedia = async (itemData, newItem) => {
        if (!confirm("Are you sure you want to delete this story?")) return;

        try {
            console.log("Attempting to delete media:", itemData);
            if (itemData.id && db) {
                // Firebase Delete
                await db.collection('gallery').doc(itemData.id).delete();
                console.log("Firebase item deleted successfully.");
            } else {
                // LocalStorage Delete
                const localItems = JSON.parse(localStorage.getItem('myUploads') || '[]');
                const filtered = localItems.filter(item => item.url !== itemData.url);
                localStorage.setItem('myUploads', JSON.stringify(filtered));
                console.log("Local item deleted successfully.");
            }
            newItem.remove();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed. Please try again.");
        }
    };

    // Load Items (from Firebase or LocalStorage)
    const loadGalleryItems = async () => {
        const mediaGallery = document.getElementById('media-gallery');
        if (!mediaGallery) return;

        // Clear existing items but preserve placeholders if any (though there are none now)
        mediaGallery.innerHTML = '';

        // Keep track of what we've already displayed to avoid duplicates
        const displayedUrls = new Set();

        const addItemToGallery = (itemData, isNew = false) => {
            if (displayedUrls.has(itemData.url)) return;
            displayedUrls.add(itemData.url);

            const newItem = document.createElement('div');
            // Always include 'active' class so photos are visible immediately
            newItem.className = 'media-item reveal active';
            newItem.style.cursor = 'pointer';

            // Add Delete Button
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'btn-delete';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = "Delete this story";
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Don't trigger modal viewer
                deleteMedia(itemData, newItem);
            });
            newItem.appendChild(deleteBtn);

            if (itemData.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = itemData.url;
                img.alt = itemData.alt || "Customer Story";
                newItem.appendChild(img);
            } else if (itemData.type.startsWith('video/')) {
                newItem.classList.add('video-item');
                const video = document.createElement('video');
                video.autoplay = false;
                video.loop = true;
                video.muted = true;
                video.style.pointerEvents = "none"; // Let the container handle hover

                const source = document.createElement('source');
                source.src = itemData.url;
                source.type = itemData.type;

                video.appendChild(source);
                newItem.appendChild(video);

                const overlay = document.createElement('div');
                overlay.className = 'video-overlay';
                overlay.innerHTML = '<i class="fas fa-play"></i>';
                newItem.appendChild(overlay);

                // Re-attach hover logic for dynamic video
                newItem.addEventListener('mouseenter', () => video.play());
                newItem.addEventListener('mouseleave', () => video.pause());
            }

            mediaGallery.insertBefore(newItem, mediaGallery.firstChild);
        };

        // 1. Load from Firebase (Shared)
        if (db) {
            try {
                // Get items sorted by timestamp
                const snapshot = await db.collection('gallery').orderBy('timestamp', 'asc').get();
                snapshot.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id; // Store ID for deletion
                    addItemToGallery(data);
                });
            } catch (error) {
                console.error("Error loading from Firebase:", error);
            }
        }

        // 2. Load from LocalStorage (Personal Fallback)
        const localItems = JSON.parse(localStorage.getItem('myUploads') || '[]');
        localItems.forEach(item => {
            addItemToGallery(item);
        });
    };

    loadGalleryItems();

    const btnUpload = document.getElementById('btn-upload-media');
    if (btnUpload) {
        btnUpload.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*,video/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                currentFileToUpload = file;
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewBody.innerHTML = '';
                    if (file.type.startsWith('image/')) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        previewBody.appendChild(img);
                    } else if (file.type.startsWith('video/')) {
                        const video = document.createElement('video');
                        video.src = event.target.result;
                        video.controls = true;
                        previewBody.appendChild(video);
                    }
                    previewModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                };
                reader.readAsDataURL(file);
            };
            input.click();
        });
    }

    if (btnConfirmUpload) {
        btnConfirmUpload.addEventListener('click', async () => {
            const file = currentFileToUpload;
            if (!file) return;

            const originalText = btnConfirmUpload.textContent;
            btnConfirmUpload.disabled = true;

            // Safety timeout to prevent infinite "UPLOADING..."
            const timeoutId = setTimeout(() => {
                if (btnConfirmUpload.disabled) {
                    btnConfirmUpload.textContent = originalText;
                    btnConfirmUpload.disabled = false;
                    alert("Upload timed out. Please check your internet connection and Firebase settings.");
                }
            }, 60000); // 1 minute timeout

            try {
                let downloadUrl = "";
                console.log("Starting upload process for:", file.name);

                if (isFirebaseReady && storage && db) {
                    btnConfirmUpload.textContent = "1/2 UPLOADING FILE...";
                    console.log("Uploading to Firebase Storage...");

                    const storageRef = storage.ref(`gallery/${Date.now()}_${file.name}`);

                    // Using upload task for better progress handling if needed
                    const uploadTask = await storageRef.put(file);
                    downloadUrl = await storageRef.getDownloadURL();
                    console.log("File uploaded to Storage. URL:", downloadUrl);

                    btnConfirmUpload.textContent = "2/2 SAVING DETAILS...";
                    console.log("Saving metadata to Firestore...");
                    await db.collection('gallery').add({
                        url: downloadUrl,
                        type: file.type,
                        name: file.name,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log("Metadata saved to Firestore.");
                } else {
                    btnConfirmUpload.textContent = "SAVING LOCALLY...";
                    console.log("Firebase not ready. Using LocalStorage fallback.");
                    downloadUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (event) => resolve(event.target.result);
                        reader.onerror = (err) => reject(err);
                        reader.readAsDataURL(file);
                    });

                    const localItems = JSON.parse(localStorage.getItem('myUploads') || '[]');
                    localItems.push({
                        url: downloadUrl,
                        type: file.type,
                        name: file.name,
                        timestamp: Date.now()
                    });
                    localStorage.setItem('myUploads', JSON.stringify(localItems));
                    console.log("Item saved to LocalStorage.");

                    if (!isFirebaseReady) {
                        alert("Success! Your story is saved locally. (Connect Firebase to share with everyone)");
                    }
                }

                clearTimeout(timeoutId);
                alert("Shared Successfully!");
                closePreview();
                await loadGalleryItems();

                const mediaGallery = document.getElementById('media-gallery');
                if (mediaGallery) {
                    mediaGallery.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

            } catch (error) {
                clearTimeout(timeoutId);
                console.error("Upload failed details:", error);

                let errorMsg = "Upload failed. ";
                if (error.code === 'storage/unauthorized' || error.message.includes('permission-denied')) {
                    errorMsg += "\n\nREASON: Access Denied. \nPlease check your Firebase Security Rules (allow read, write: if true).";
                } else if (error.code === 'storage/retry-limit-exceeded') {
                    errorMsg += "\n\nREASON: Network timeout. Check your connection.";
                } else {
                    errorMsg += "\n\nERROR: " + error.message;
                }

                alert(errorMsg);
            } finally {
                btnConfirmUpload.textContent = originalText;
                btnConfirmUpload.disabled = false;
            }
        });
    }

    // Expertise Slideshow Timer Logic
    const slideshows = document.querySelectorAll('.service-slideshow');
    slideshows.forEach((slideshow, sIndex) => {
        const images = slideshow.querySelectorAll('img');
        if (images.length === 0) return;

        let currentIndex = 0;

        // Stagger the start of each slideshow
        setTimeout(() => {
            setInterval(() => {
                // Remove active class from all images in this slideshow
                images.forEach(img => img.classList.remove('active'));

                // Move to next index
                currentIndex = (currentIndex + 1) % images.length;

                // Add active class to next image
                images[currentIndex].classList.add('active');
            }, 5000); // 5 second interval
        }, sIndex * 500); // 500ms stagger
    });

    // Re-select WA form since we added more code
    const waForm = document.getElementById('whatsapp-contact-form');
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('wa-name').value;
            const email = document.getElementById('wa-email').value;
            const phone = document.getElementById('wa-phone').value;
            const service = document.getElementById('wa-service').value;
            const message = document.getElementById('wa-message').value;
            const whatsappNumber = "919539548759";
            const text = `*New Inquiry via Website*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Service:* ${service}\n*Project Details:* ${message || 'N/A'}`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank');
            waForm.reset();
        });
    }
});
