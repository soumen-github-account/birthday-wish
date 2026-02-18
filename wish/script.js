
        /* ===== 1. STARS ===== */
        const starsEl = document.getElementById('stars');
        for (let i = 0; i < 120; i++) {
            const s = document.createElement('div');
            s.className = 'star';
            const size = Math.random() * 2.5 + 0.5;
            s.style.cssText = `
                width:${size}px; height:${size}px;
                top:${Math.random()*100}%; left:${Math.random()*100}%;
                --t:${(Math.random()*4+2).toFixed(1)}s;
                --d:${-(Math.random()*5).toFixed(1)}s;
            `;
            starsEl.appendChild(s);
        }

        /* ===== 2. FIREWORKS ===== */
        const canvas = document.getElementById('fw-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resize() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor(x, y, color, burst = false) {
                this.x = x; this.y = y; this.color = color;
                const speed = burst ? Math.random() * 12 + 3 : Math.random() * 8 + 1;
                const angle = Math.random() * Math.PI * 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed - (burst ? 2 : 0);
                this.alpha = 1;
                this.friction = 0.94;
                this.gravity = 0.12;
                this.size = burst ? Math.random() * 3 + 1.5 : Math.random() * 2 + 1;
                this.trail = burst;
            }
            draw() {
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            update() {
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.trail ? 0.018 : 0.012;
            }
        }

        const COLORS = ['#ff00cc','#9d00ff','#00d4ff','#ffffff','#ffd700','#39ff14','#ff6600'];

        function createFirework(x, y, big = false) {
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];
            const count = big ? 80 : 45;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(x, y, color, big));
            }
            // Sparkle ring
            const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
            for (let i = 0; i < 20; i++) {
                particles.push(new Particle(x, y, color2));
            }
        }

        function autoFirework() {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height * 0.55;
            createFirework(x, y, Math.random() > 0.5);
        }

        function animateLoop() {
            ctx.fillStyle = 'rgba(5, 5, 16, 0.18)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            particles = particles.filter(p => p.alpha > 0);
            for (const p of particles) { p.update(); p.draw(); }
            ctx.globalAlpha = 1;
            requestAnimationFrame(animateLoop);
        }
        animateLoop();

        // Staggered fireworks for a cinematic opening
        [800, 1600, 2200, 3000, 4000].forEach(t => setTimeout(autoFirework, t));
        setInterval(autoFirework, 2200);
        setInterval(() => autoFirework(), 3500); // second stream offset

        /* ===== 3. FLOATING ELEMENTS ===== */
        const ambient = document.getElementById('ambient');
        const balloonColors = [
            'var(--neon-pink)','var(--neon-violet)','var(--neon-blue)',
            '#39ff14','#ffd700','#ff6600'
        ];

        function spawnBalloon() {
            const el = document.createElement('div');
            el.className = 'floating-el balloon';
            const col = balloonColors[Math.floor(Math.random() * balloonColors.length)];
            el.style.color = col;
            el.style.backgroundColor = col;
            el.style.left = (Math.random() * 95) + 'vw';
            const dur = (Math.random() * 12 + 14).toFixed(1);
            const del = -(Math.random() * 10).toFixed(1);
            el.style.setProperty('--dur', dur + 's');
            el.style.setProperty('--del', del + 's');
            el.style.setProperty('--drift', ((Math.random()-0.5)*60).toFixed(0) + 'px');
            el.style.setProperty('--rot', ((Math.random()-0.5)*20).toFixed(0) + 'deg');
            ambient.appendChild(el);
        }

        function spawnTeddy() {
            const el = document.createElement('div');
            el.className = 'floating-el teddy';
            el.textContent = '🧸';
            el.style.left = (Math.random() * 90) + 'vw';
            const dur = (Math.random() * 15 + 20).toFixed(1);
            const del = -(Math.random() * 10).toFixed(1);
            el.style.setProperty('--dur', dur + 's');
            el.style.setProperty('--del', del + 's');
            el.style.setProperty('--drift', ((Math.random()-0.5)*50).toFixed(0) + 'px');
            el.style.setProperty('--rot', '0deg');
            ambient.appendChild(el);
        }

        function spawnStar() {
            const el = document.createElement('div');
            el.className = 'floating-el star-el';
            el.textContent = ['⭐','✨','🌟','💫'][Math.floor(Math.random()*4)];
            el.style.left = (Math.random() * 95) + 'vw';
            const dur = (Math.random() * 12 + 12).toFixed(1);
            const del = -(Math.random() * 8).toFixed(1);
            el.style.setProperty('--dur', dur + 's');
            el.style.setProperty('--del', del + 's');
            el.style.setProperty('--drift', ((Math.random()-0.5)*40).toFixed(0) + 'px');
            el.style.setProperty('--rot', '0deg');
            ambient.appendChild(el);
        }

        // Initial spawns
        for (let i = 0; i < 10; i++) spawnBalloon();
        for (let i = 0; i < 4; i++) spawnTeddy();
        for (let i = 0; i < 6; i++) spawnStar();

        // Periodic spawning
        setInterval(spawnBalloon, 3000);
        setInterval(spawnTeddy, 7000);
        setInterval(spawnStar, 4000);

        // Cleanup old elements
        setInterval(() => {
            const els = ambient.querySelectorAll('.floating-el');
            if (els.length > 60) els[0].remove();
        }, 5000);

        /* ===== 4. CLICK INTERACTION ===== */
        document.addEventListener('click', (e) => {
            if (e.target.id === 'userName') return;
            createFirework(e.clientX, e.clientY, true);
        });


        /* ===== 6. GIFT BOX ===== */
        const confettiColors = ['#ff00cc','#9d00ff','#00d4ff','#ffd700','#39ff14','#ff6600','#ffffff'];

        function spawnConfetti(x, y, count) {
            count = count || 30;
            for (var i = 0; i < count; i++) {
                var c = document.createElement('div');
                c.className = 'confetti-piece';
                var col = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                var dx = (Math.random() - 0.5) * 220;
                var dur = (Math.random() * 1.2 + 1.0).toFixed(2);
                var del = (Math.random() * 0.3).toFixed(2);
                var w = (Math.random() * 8 + 5).toFixed(1);
                var br = Math.random() > 0.5 ? '50%' : '2px';
                c.style.background = col;
                c.style.left = x + 'px';
                c.style.top = y + 'px';
                c.style.setProperty('--dx', dx + 'px');
                c.style.setProperty('--dur', dur + 's');
                c.style.setProperty('--del', del + 's');
                c.style.width = w + 'px';
                c.style.height = w + 'px';
                c.style.borderRadius = br;
                document.body.appendChild(c);
                (function(el, d, dl){ setTimeout(function(){ el.remove(); }, (parseFloat(d)+parseFloat(dl)+0.2)*1000); })(c, dur, del);
            }
        }

        function openGift(el, msg, idx) {
            if (el.classList.contains('opened')) return;
            el.classList.add('opened');
            var label = el.closest('.gift-item').querySelector('.gift-label');
            if (label) label.textContent = '🎉 Opened!';
            var rect = el.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            spawnConfetti(cx, cy, 40);
            createFirework(cx, cy, true);
            setTimeout(function(){ createFirework(cx, cy - 80, false); }, 300);
        }

        function openAllGifts() {
            ['gift1','gift2','gift3'].forEach(function(id, i) {
                setTimeout(function() {
                    var el = document.getElementById(id);
                    if (el) openGift(el, '', i+1);
                }, i * 400);
            });
        }

        /* ===== 5. NAME EDIT ===== */
        function updateName() {
            const name = prompt("🎉 Enter the Birthday Star's Name:");
            if (name && name.trim()) {
                document.getElementById('userName').textContent = name.trim().toUpperCase();
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => autoFirework(), i * 250);
                }
            }
        }
