package sockets;

import java.io.IOException;

import jakarta.websocket.EncodeException;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import model.Cell;
import model.Player;
import model.Reversi;
import model.Winner;

@ServerEndpoint(value = "/reversi", encoders = MessageEncoder.class, decoders = MoveMessageDecoder.class)
public class Endpoint {

    private static Session s1;
    private static Session s2;
    private static Reversi game;

    @OnOpen
    public void onOpen(Session session) throws IOException, EncodeException {
        if (s1 == null) {
            s1 = session;
            s1.getBasicRemote().sendObject(new Message(ConnectionType.OPEN, Player.PLAYER1));
        } else if (s2 == null) {
            game = new Reversi(8, 8);
            s2 = session;
            s2.getBasicRemote().sendObject(new Message(ConnectionType.OPEN, Player.PLAYER2));
            sendMessage(new Message(ConnectionType.MESSAGE, game.getTurn(), game.getBoard()));
        } else {
            session.close();
        }
    }

    @OnMessage
    public void onMessage(Session session, Cell message) throws IOException, EncodeException {
        try {
            Winner ret = game.move(session == s1 ? Player.PLAYER1 : Player.PLAYER2, message);
            if (ret == Winner.NONE) {
                sendMessage(new Message(ConnectionType.MESSAGE, game.getTurn(), game.getBoard()));
            } else {
                sendMessage(new Message(ConnectionType.ENDGAME, ret, game.getBoard()));
                s1.close();
                s2.close();
                s1 = null;
                s2 = null;
            }
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
        }
    }

    private void sendMessage(Message msg) throws EncodeException, IOException {
        s1.getBasicRemote().sendObject(msg);
        s2.getBasicRemote().sendObject(msg);
    }
}
