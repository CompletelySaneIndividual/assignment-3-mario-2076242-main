import Entity from "../entities/Entity.js";
import { timer } from "../globals.js";
import Background from "./Background.js";
import EntityTypes from "../enums/EntityType.js";
import Flagpole from "../objects/Flagpole.js";
import Tile from "../objects/Tile.js";
import Vector from "../../lib/Vector.js";
import LevelMaker from "../services/LevelMaker.js";
import TileType from "../enums/TileType.js";

export default class Level {
	constructor(tilemap, entities = [], objects = []) {
		this.tilemap = tilemap;
		this.entities = entities;
		this.objects = objects;
		this.background = new Background(this.tilemap.canvasDimensions);
		this.flagSpawned = false;
		this.hasWonLevel = false;
	}

	update(dt) {
		this.cleanUpEntitiesAndObjects();

		timer.update(dt);

		this.tilemap.update(dt);
		this.background.update();

		this.objects.forEach((object) => {
			object.update(dt);
		});

		this.entities.forEach((entity) => {
			entity.update(dt);
		});
	}

	render() {
		this.background.render();
		this.tilemap.render();

		this.objects.forEach((object) => {
			object.render();
		});

		this.entities.forEach((entity) => {
			entity.render();
		});
	}

	cleanUpEntitiesAndObjects() {
		this.entities = this.entities.filter((entity) => !entity.cleanUp);
		this.objects = this.objects.filter((object) => !object.cleanUp);

		if(this.allSnailsGone() && this.flagSpawned === false) {
			this.flagSpawned = true;

			let x = LevelMaker.DEFAULT_LEVEL_WIDTH-2;
			for (let y = 0; y < this.tilemap.tileDimensions.y - 1; y++) {
				// Only spawn snails on ground tiles.
				if (this.tilemap.tiles[y][x].id === TileType.Ground) {
					// 10% chance to spawn a snail.
					this.addObject(new Flagpole(
						new Vector(Flagpole.WIDTH, Flagpole.HEIGHT),
						new Vector(x * Tile.SIZE, (y - 3) * Tile.SIZE), this))
					return;
				}
			}
		}
	}

	allSnailsGone(){
		for (let i = 0; i < this.entities.length; i++) {
			if(this.entities[i].type === EntityTypes.Snail){
				return false;
			}
		}
		return true;
	}

	hasWon(){
		return this.hasWonLevel;
	}

	/**
	 * @param {Entity} entity
	 */
	addEntity(entity) {
		this.entities.push(entity);
	}
	addObject(object) {
		this.objects.push(object);
	}

	addCamera(camera) {
		this.background.addCamera(camera);
	}
}
