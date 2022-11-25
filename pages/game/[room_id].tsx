import { NextPageContext } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import prisma from "../../database/prisma";
import { useSocket } from "../../hooks/useSocket";
import { EVENTS } from "../../socket/events.types";
import { Cookie } from "../../utils/Cookie";
import { STATUS } from "../../utils/GameDataTypes";

export async function getServerSideProps(context: NextPageContext) {
	// get room_id from params
	const { room_id } = context.query;

	let player_id = Cookie.getPlayerID(context.req, context.res);

	console.log(player_id);

	if (!player_id) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	player_id = player_id.toString();

	if (!room_id) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	// TODO: Check if the room exists
	const players = await prisma.player.findMany({
		where: {
			game_room_id: room_id as string,
		},
	});

	const partyLeader = await prisma.player.findFirst({
		where: {
			game_room_id: room_id as string,
			is_party_leader: true,
		},
	});

	if (players.length === 0) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	// Check the players and see if the player is the party leader
	const isPartyLeader = partyLeader?.player_id === player_id;

	return {
		props: {
			// Pass the query string to the page
			r: room_id,
			player_id,
			isPartyLeader,
			players: players.map((player) => ({
				...player,
				joined_at: player.joined_at!.toISOString(),
			})),
		},
	};
}

export default function GamePage({
	r: roomID,
	player_id,
	isPartyLeader,
}: {
	r: string;
	player_id: string;
	isPartyLeader: boolean;
}) {
	const [room_id] = useState<string>(roomID);
	const [players, setPlayers] = useState<any[]>([]);

	const [gameStatus, setGameStatus] = useState<string>("in_lobby");

	const { socket } = useSocket();

	useEffect(() => {
		console.log(socket);
		if (socket) {
			console.log("Emitting join_room");

			socket.emit(EVENTS.JOIN_ROOM, {
				room_id: room_id,
			});

			socket.on(EVENTS.ROOM_PLAYERS_UPDATE, (data) => {
				console.log(EVENTS.ROOM_PLAYERS_UPDATE, " received");
				setPlayers(data);
			});

			socket.on(EVENTS.STATUS_CHANGE, (data) => {
				console.log("Status change received");
				setGameStatus(data.status);
			});

			socket.on("disconnect", () => {
				console.log("Disconnected");
				// Tell the server that they have been disconnected
				socket.emit(EVENTS.DISCONNECTED, {
					room_id: room_id,
					player_id,
				});
			});
		}
	}, [socket, room_id, player_id]);

	useEffect(() => {
		return () => {
			if (socket) {
				console.log("Leaving room");
				// Tell the server that they have been disconnected
				socket.emit(EVENTS.DISCONNECTED, {
					room_id: room_id,
					player_id,
				});
			}
		};
	}, [player_id, room_id, socket]);

	const inLobbyGame = () => {
		if (!socket) return;
		socket.emit(EVENTS.STATUS_CHANGE, {
			room_id: room_id,
			status: STATUS.IN_LOBBY,
		});
	};

	return (
		<div>
			<Head>
				<title>Create Next App</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<p>Room ID: {room_id}</p>
			</main>

			{isPartyLeader && (
				<>
					<button
						onClick={inLobbyGame}
						disabled={gameStatus !== STATUS.IN_PROGRESS}
					>
						Stop Game
					</button>
				</>
			)}
		</div>
	);
}
