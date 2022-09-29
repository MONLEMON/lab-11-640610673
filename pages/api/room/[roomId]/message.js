import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";
import { readUsersDB } from "../../../../backendLibs/dbLib";
export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const roomtoken = checkToken(req);
    if (!roomtoken) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
    //get roomId from url
    //check if roomId exist
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);
    if (roomIdx === -1) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }
    return res.json({
      ok: true,
      messages: rooms[roomIdx].messages,
    });

    //find room and return
    //...
  } else if (req.method === "POST") {
    //check token
    const roomtoken = checkToken(req);
    if (!roomtoken) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
    //get roomId from url

    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();
    //check if roomId exist
    const roomIdx = rooms.findIndex((x) => x.roomId === roomId);
    if (roomIdx === -1) {
      return res.status(404).json({ ok: false, message: "Invalid room id" });
    }
    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    const users = readUsersDB();

    //create message
    const newId = uuidv4();
    const message = {
      messageId: newId,
      text: req.body.text,
      username: roomtoken.username,
    };
    rooms[roomIdx].messages.push(message);
    writeChatRoomsDB(rooms);
    return res.json({
      ok: true,
      message: message,
    });
  }
}
