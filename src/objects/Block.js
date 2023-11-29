import GameObject from "./GameObject.js";
import Coin from "./Coin.js";
import Mushroom from "./Mushroom.js";
import Sprite from "../../lib/Sprite.js";
import Tile from "./Tile.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import { images, sounds, timer } from "../globals.js";
import Vector from "../../lib/Vector.js";
import { getRandomPositiveInteger } from "../../lib/RandomNumberHelpers.js";

export default class Block extends GameObject {
	static WIDTH = Tile.SIZE;
	static HEIGHT = Tile.SIZE;
	static TOTAL_SPRITES = 5;
	static NOT_HIT = 1;
	static HIT = 4;

	/**
	 * A "box" that the player can hit from beneath to reveal a coin.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;

		this.sprites = Block.generateSprites();
		this.currentFrame = Block.NOT_HIT;
	}

	static generateSprites() {
		const sprites = [];

		for (let y = 0; y < Block.TOTAL_SPRITES; y++) {
			sprites.push(new Sprite(
				images.get(ImageName.Blocks),
				0,
				y * Block.HEIGHT,
				Block.WIDTH,
				Block.HEIGHT
			));
		}

		return sprites;
	}

	onCollision(collider) {
		if (this.wasCollided) {
			sounds.play(SoundName.EmptyBlock);
			return;
		}

		super.onCollision(collider);
		if(getRandomPositiveInteger(0, 10) < 3){//1 in 20 chance
			console.log("creating mushroom");
			const mushroom = new Mushroom(
				new Vector(Mushroom.WIDTH, Mushroom.HEIGHT),
				new Vector(this.position.x, this.position.y),
			);

			// Make the mushroom move up from the block and play a sound.
			timer.tween(mushroom.position, ['y'], [this.position.y - Mushroom.HEIGHT], 0.1);
			sounds.play(SoundName.Reveal);

			// Make the block move up and down.
			timer.tween(this.position, ['y'], [this.position.y - 5], 0.1, () => {
				timer.tween(this.position, ['y'], [this.position.y + 5], 0.1);
			});

			/**
			 * Since we want the mushroom to appear like it's coming out of the block,
			 * We add the mushroom to the beginning of the objects array. This way,
			 * when the objects are rendered, the mushrooms will be rendered first,
			 * and the blocks will be rendered after.
			 */
			 collider.level.objects.unshift(mushroom);
		}else{
			const coin = new Coin(
				new Vector(Coin.WIDTH, Coin.HEIGHT),
				new Vector(this.position.x, this.position.y),
			);

			// Make the coin move up from the block and play a sound.
			timer.tween(coin.position, ['y'], [this.position.y - Coin.HEIGHT], 0.1);
			sounds.play(SoundName.Reveal);

			// Make the block move up and down.
			timer.tween(this.position, ['y'], [this.position.y - 5], 0.1, () => {
				timer.tween(this.position, ['y'], [this.position.y + 5], 0.1);
			});

			/**
			 * Since we want the coin to appear like it's coming out of the block,
			 * We add the coin to the beginning of the objects array. This way,
			 * when the objects are rendered, the coins will be rendered first,
			 * and the blocks will be rendered after.
			 */
			collider.level.objects.unshift(coin);
		}

		this.currentFrame = Block.HIT;
	}
}
