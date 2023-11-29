import GameObject from "./GameObject.js";
import Tile from "./Tile.js";
import { images, sounds } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";

export default class Flagpole extends GameObject{
    static WIDTH = Tile.SIZE;
	static HEIGHT = Tile.SIZE * 3;
    static FLAG_HEIGHT = Tile.SIZE;
    static FLAG_OFFSET = 7;
    static TOTAL_SPRITES = 6;
    static TOTAL_COLORS = 4;

    constructor(dimensions, position, level) {
		super(dimensions, position);

		this.isConsumable = true;
        this.flagpoleFlags = [];

        this.level = level;

		this.sprites = Flagpole.generateSprites();
		this.animation = new Animation([1, 2], 0.3);
        this.color = 1;
	}

	update(dt) {
		this.animation.update(dt);
		this.currentFrame = this.animation.getCurrentFrame();
	}

	onConsume(player) {
		if (this.wasConsumed) {
			return;
		}

		super.onConsume();
		sounds.play(SoundName.PickUp);
		
        this.level.hasWonLevel = true;
        console.log("Won")

		this.cleanUp = true;
	}

    static generateSprites() {
		const sprites = [];

        this.color = getRandomPositiveInteger(0, 3);

        sprites.push(new Sprite(
            images.get(ImageName.Flagpole),
            (this.color +2) * Flagpole.WIDTH,
            0,
            Flagpole.WIDTH,
            Flagpole.HEIGHT
        ));

        

        this.flagpoleFlags = [];
        
        let y = this.color;
        for(let x = 6; x < 8; x++) {
            sprites.push(new Sprite(
                images.get(ImageName.Flagpole),
                x * Tile.SIZE,
                y * Tile.SIZE,
                Flagpole.WIDTH,
                Flagpole.FLAG_HEIGHT
            ));
        }
        

        console.log(this.flagpoleFlags)
		return sprites;
	}

    render() {
        this.sprites[this.currentFrame].render(this.position.x + Flagpole.FLAG_OFFSET, this.position.y);
        this.sprites[0].render(this.position.x, this.position.y);
	}
}