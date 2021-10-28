
class App{
    constructor() {
        this.ballColours = {
            0: 'RED',
            1: 'BLUE',
            2: 'YELLOW',
            3: 'LIME',
            4: 'PURPLE',
            5: 'ORANGE',
            6: 'AQUA',
            7: 'TEAL',
            8: 'GREEN',
            9: 'WHITE',
            10: 'FUCHSIA',
            11: 'LIGHTPINK',
            12: 'BROWN',
            13: 'MIDNIGHTBLUE'
        };
                
        this.animatorTab = document.getElementById('animator');
        this.builderTab = document.getElementById('builder');
        this.lnkAnimator = document.getElementById('lnkAnimator');
        this.lnkBuilder = document.getElementById('lnkBuilder');
        
        this.lnkAnimator.addEventListener('click', () => {
            this.hideBuilder();
            this.showAnimator();
        });
        
        this.lnkBuilder.addEventListener('click', () => {
            //Feel like this shouldn't be here, but I would have to create an 'exiting' func and call that.  Probably should for both tools. 
            this.animator.ifPlayingPause();
            this.hideAnimator();
            this.showBuilder();            
        });
        
        this.builder = new Builder(this.ballColours);
        this.animator = new Animator(this.ballColours);
        this.solver = new Solver(this.ballColours);

        // Hides Builder initially
        // this.hideAnimator();
        this.hideBuilder();
    }
    showAnimator() {
        this.animatorTab.style.display = 'block';
    }

    showBuilder() {
        this.builderTab.style.display = 'block';
    }

    hideAnimator() {
        this.animatorTab.style.display = 'none';
        this.showBuilder();
    }

    hideBuilder() {
        this.builderTab.style.display = 'none';
        this.showAnimator();
    }
}

app = new App();

