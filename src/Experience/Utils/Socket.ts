import { io } from "socket.io-client"
import Experience from "../Experience";
import User from "../World/User";

export default class Socket {
  private static _instance: Socket | null; // Singleton

  // Class
  experience = Experience.Instance()
  players: {[key:  string]: User} = {}

  // State
  socket = io("ws://localhost:8000")

  constructor() {
    Socket._instance = this

    this.listen()
  }

  listen() {
    this.socket.emit('ready');

    this.socket.on("connect", () => {
      console.log("socket: ", this.socket)
      console.log("socket id", this.socket.id); // x8WIv7-mJelg7on_ALbx
    });

    this.socket.on("disconnect", () => {
      console.log(this.socket.id); // undefined
    });

    this.socket.on("move", (args: any) => {
      console.log("args: ", args)
    });
    
  }

  public static Instance()
  {
    return this._instance || ( this._instance = new this() );
  }
}