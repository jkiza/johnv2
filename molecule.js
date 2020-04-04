class Molecule {
    constructor(_i) {
        this.position = createVector(0, 0);
        this.velocity = createVector(random(-2, 2), random(-2, 2));
        this.arrayPosition = _i;
        this.radius = random(radiusMin, radiusMax);
        this.intersecting = false;
        this.top = false;
        this.bottom = false;
        this.left = false;
        this.right = false;
        this.bounce = true;
    }

    render() {
        //noStroke()
        stroke(200, 200, 200);
        strokeWeight(2);

        if (this.intersecting) {
            fill(255, 50, 0, 255);
        } else {
            fill(0, 50, 50, 125);
        }

        push()
        translate(this.position.x, this.position.y);

        ellipse(0, 0, this.radius * 2, this.radius * 2);

        noStroke();
        fill(255, 255, 255, 255);
        textSize(15);
        textAlign(CENTER, CENTER);
        text(this.arrayPosition, 0, 0);
        pop();
    }

    step() {
        this.position.add(this.velocity);
    }

    checkEdges() {
        if (this.position.x < this.radius || this.position.x > width - this.radius) {
            this.velocity.x = this.velocity.x * -1
        }

        if (this.position.y < this.radius || this.position.y > height - this.radius) {
            this.velocity.y = this.velocity.y * -1
        }
    }

    checkIntersecting(_indexValue) {

        let dist = p5.Vector.sub(this.position, molecules[_indexValue].position);
        
        stroke(150, 0, 0, 100);
        strokeWeight(1);
        
        if (showLines) {
            line(this.position.x, this.position.y, molecules[_indexValue].position.x, molecules[_indexValue].position.y);
        }
        
        if (dist.mag() <= this.radius + molecules[_indexValue].radius) {
            //console.log("changed")
            this.intersecting = true;
            molecules[_indexValue].intersecting = true;
            
            if (dist.mag() > 0.0) {
                
                let heading = dist.heading();
                let moveDistance = abs(dist.mag() - this.radius - molecules[_indexValue].radius);
                
                let dy = moveDistance * Math.sin(heading);
                let dx = moveDistance * Math.cos(heading);
                
                this.position.x += dx / 2;
                this.position.y += dy / 2;
            }
            
            if (this.bounce) {

                let dx = this.position.x - molecules[_indexValue].position.x;
                let dy = this.position.y - molecules[_indexValue].position.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                let normalX = dx / dist;
                let normalY = dy / dist;

                let midpointX = (this.position.x.x + molecules[_indexValue].position.x) / 2;
                let midpointY = (this.position.x.y + molecules[_indexValue].position.y) / 2;

                let dVector = (this.velocity.x - molecules[_indexValue].velocity.x) * normalX;
                dVector += (this.velocity.y - molecules[_indexValue].velocity.y) * normalY;

                let dvx = dVector * normalX;
                let dvy = dVector * normalY;

                this.velocity.x -= dvx;
                this.velocity.y -= dvy;
                molecules[_indexValue].velocity.x += dvx;
                molecules[_indexValue].velocity.y += dvy;
            }
            
            return true;
        }
    }

    reset() {
        this.intersecting = false;
    }
}

class Healthy extends Molecule {
    constructor(_i) {
        super(_i);
        this.health = 1;
    }
    
    render() {
        //noStroke()
        stroke(200, 200, 200);
        strokeWeight(2);

        if (this.intersecting) {
            fill(155, 50, 0, 255);
        } else {
            fill(0, 255, 0, 125);
        }

        push()
        translate(this.position.x, this.position.y);

        ellipse(0, 0, this.radius * 2, this.radius * 2);

        noStroke();
        fill(255, 255, 255, 255);
        textSize(15);
        textAlign(CENTER, CENTER);
        text(this.arrayPosition, 0, 0);
        pop();
    }
    
    checkHealth(_indexValue) {
        let otherMolecule = molecules[_indexValue];
        if(otherMolecule.constructor.name == "Infected") {
            let randomNum = random();
            if(randomNum < 0.05) {
                molecules[this.arrayPosition] = new Infected(this.arrayPosition);
                molecules[this.arrayPosition].position = this.position;
                molecules[this.arrayPosition].velocity = this.velocity;
                molecules[this.arrayPosition].radius = this.radius;
            }
        }
    }
}

class Infected extends Molecule {
    constructor(_i) {
        super(_i);
        this.health = 0;
    }
    
    render() {
        //noStroke()
        stroke(200, 200, 200);
        strokeWeight(2);

        if (this.intersecting) {
            fill(155, 50, 0, 255);
        } else {
            fill(255, 0, 0, 125);
        }

        push()
        translate(this.position.x, this.position.y);

        ellipse(0, 0, this.radius * 2, this.radius * 2);

        noStroke();
        fill(255, 255, 255, 255);
        textSize(15);
        textAlign(CENTER, CENTER);
        text(this.arrayPosition, 0, 0);
        pop();
    }
    
    checkHealth(_indexValue) {
        let otherMolecule = molecules[_indexValue];
        if(otherMolecule.constructor.name == "Healthy") {
            let randomNum = random();
            if(randomNum < 0.05) {
                molecules[this.arrayPosition] = new Infected(otherMolecule.arrayPosition);
                molecules[this.arrayPosition].position = otherMolecule.position;
                molecules[this.arrayPosition].velocity = otherMolecule.velocity;
                molecules[this.arrayPosition].radius = otherMolecule.radius;
            }
        }
    }
}
