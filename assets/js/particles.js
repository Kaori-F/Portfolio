// Particles.js - Creates beautiful iridescent particles for Crystal Shard Portfolio

class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.particles');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.isActive = true;
        
        // Configuration
        this.config = {
            particleCount: 100,
            particleSize: { min: 1, max: 3 },
            speed: { min: 0.2, max: 0.8 },
            colors: [
                'rgba(255, 100, 255, 0.8)',  // Pink
                'rgba(100, 200, 255, 0.8)',  // Blue
                'rgba(200, 255, 100, 0.8)',  // Green
                'rgba(255, 200, 100, 0.8)'   // Yellow
            ],
            maxDistance: 150,
            connectionOpacity: 0.2
        };
        
        this.init();
    }
    
    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        
        // Set canvas size
        this.resizeCanvas();
        
        // Create particles
        this.createParticles();
        
        // Add event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Start animation loop
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: this.config.particleSize.min + Math.random() * (this.config.particleSize.max - this.config.particleSize.min),
                speedX: (Math.random() - 0.5) * this.config.speed.max,
                speedY: (Math.random() - 0.5) * this.config.speed.max,
                color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
                opacity: 0.3 + Math.random() * 0.7
            });
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections first (so they appear behind particles)
        this.drawConnections();
        
        // Draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = p.size * 2;
            this.ctx.shadowColor = p.color;
            
            // Reset shadow for next drawing
            this.ctx.shadowBlur = 0;
        }
    }
    
    drawConnections() {
        this.ctx.lineWidth = 0.5;
        this.ctx.globalAlpha = this.config.connectionOpacity;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                // Calculate distance between particles
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only draw connection if particles are close enough
                if (distance < this.config.maxDistance) {
                    // Opacity based on distance
                    const opacity = 1 - (distance / this.config.maxDistance);
                    
                    // Create gradient for iridescent effect
                    const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    gradient.addColorStop(0, p1.color);
                    gradient.addColorStop(1, p2.color);
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = gradient;
                    this.ctx.globalAlpha = opacity * this.config.connectionOpacity;
                    this.ctx.stroke();
                }
            }
        }
        
        // Reset global alpha
        this.ctx.globalAlpha = 1;
    }
    
    updateParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Mouse interaction - gentle attraction
            if (this.mouseX && this.mouseY) {
                const dx = this.mouseX - p.x;
                const dy = this.mouseY - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    p.x += dx * 0.002;
                    p.y += dy * 0.002;
                }
            }
            
            // Boundary check - wrap around
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;
        }
    }
    
    animate() {
        if (this.isActive) {
            this.updateParticles();
            this.drawParticles();
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    // Public methods
    pause() {
        this.isActive = false;
    }
    
    resume() {
        this.isActive = true;
    }
    
    setParticleCount(count) {
        this.config.particleCount = count;
        this.createParticles();
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.particleSystem = new ParticleSystem();
});
