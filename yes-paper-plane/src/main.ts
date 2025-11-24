import Phaser from "phaser";
import { phaserConfig } from "./gameConfig";
import Boot from "@scenes/Boot";
import Menu from "@scenes/Menu";
import Game from "@scenes/Game";
import HUD from "@scenes/HUD";

new Phaser.Game({
  ...phaserConfig,
  scene: [Boot, Menu, Game, HUD]
});












