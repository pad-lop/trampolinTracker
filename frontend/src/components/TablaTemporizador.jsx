import { useMemo, useState, useEffect } from "react";
import {
	DataTable,
	TableContainer,
	Table,
	TableToolbar,
	TableToolbarContent,
	TableToolbarSearch,
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
	OverflowMenu,
	OverflowMenuItem,
	Button,
	IconButton,
} from "carbon-components-react";
import { Add, Error } from "@carbon/icons-react";
import { useTemporizadorStore } from "../store/appStore";

const TablaTemporizador = ({ setOpenProductModal }) => {
	const headers = [
		{
			header: "ID Recibo",
			key: "receiptId",
		},
		{ header: "Nombre", key: "descripcion" },
		{ header: "Hora Inicio", key: "fecha" },
		{ header: "Tiempo Rentado", key: "tiempoRentado" },
		{ header: "Tiempo Restante", key: "tiempoRestante" },
		{ header: "Detener", key: "detenido" },
	];

	const { temporizadorRows, updateTiempoRestante, stopTemporizadorRow } =
		useTemporizadorStore((state) => ({
			temporizadorRows: state.temporizadorRows,
			updateTiempoRestante: state.updateTiempoRestante,
			stopTemporizadorRow: state.stopTemporizadorRow,
		}));

	const { searchTerm, setSearchTerm } = useTemporizadorStore();

	const filteredRows = useMemo(() => {
		const prefilteredRows = temporizadorRows.filter((row) =>
			row.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
		);

		return [...prefilteredRows].reverse();
	}, [temporizadorRows, searchTerm]);

	const handleProductSearch = (term) => {
		setSearchTerm(term);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			updateTiempoRestante();
		}, 500);
		return () => clearInterval(interval);
	}, [temporizadorRows, updateTiempoRestante]);

	const formatTimeRemaining = (row) => {
		const temporizadorRow = temporizadorRows.find(
			(temporizadorRow) => temporizadorRow.id === row.id
		);

		if (temporizadorRow.detenido) {
			const isNegative = temporizadorRow.tiempoUsado < 0;

			const absoluteSeconds = Math.abs(temporizadorRow.tiempoUsado);
			const minutes = Math.floor(absoluteSeconds / 60);
			const remainingSeconds = Math.ceil(absoluteSeconds % 60);
			const formattedTime = `${
				isNegative ? "-" : ""
			}${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;

			const style = {
				color: "green",
			};

			return { formattedTime, style };
		}

		let seconds = 0;
		if (temporizadorRow.tiempoRestante !== undefined) {
			seconds = temporizadorRow.tiempoRestante;
		}
		const isNegative = seconds < 0;
		const absoluteSeconds = Math.abs(seconds);
		const minutes = Math.floor(absoluteSeconds / 60);
		const remainingSeconds = Math.ceil(absoluteSeconds % 60);
		const formattedTime = `${isNegative ? "-" : ""}${minutes}:${remainingSeconds
			.toString()
			.padStart(2, "0")}`;
		const style = {
			color:
				seconds <= 60
					? "red"
					: seconds >= temporizadorRow.tiempoRentado * 60
					? "blue"
					: "inherit",
		};
		return { formattedTime, style };
	};

	const formatTime = (dateString) => {
		if (!dateString) {
			return ""; // or return a default value, e.g., "Invalid Date"
		}

		const datetime = new Date(dateString);
		const dayName = datetime.toLocaleString("es", { weekday: "long" });
		const day = datetime.getDate();
		let hour = datetime.getHours();
		let minute = datetime.getMinutes();
		const period = hour < 12 ? "AM" : "PM";

		hour = hour % 12;
		if (hour === 0) {
			hour = 12;
		}
		if (minute < 10) {
			minute = "0" + minute;
		}

		return `${hour}:${minute} ${period}, ${dayName} ${day}`;
	};

	const handleStopRow = (row) => {
		"parar", row;
		console.log(row.cells[4].value < 0);
		stopTemporizadorRow(row.id, row.cells[4].value);
	};

	return (
		<DataTable
			size="xl"
			rows={filteredRows}
			headers={headers}
			render={({
				rows,
				headers,
				getHeaderProps,
				getRowProps,
				getTableProps,
			}) => (
				<TableContainer style={{ marginTop: "46px" }}>
					<TableToolbar aria-label="data table toolbar">
						<TableToolbarContent>
							<TableToolbarSearch
								onChange={(event) => handleProductSearch(event.target.value)}
							/>
							<Button
								onClick={() => setOpenProductModal(true)}
								renderIcon={Add}
								size="md"
							>
								Agregar
							</Button>
						</TableToolbarContent>
					</TableToolbar>
					<Table
						{...getTableProps()}
						size="lg"
						useZebraStyles={false}
						aria-label="sample table"
					>
						<TableHead>
							<TableRow>
								{headers.map((header) => (
									<TableHeader key={header.key} {...getHeaderProps({ header })}>
										{header.header}
									</TableHeader>
								))}
							</TableRow>
						</TableHead>
						{/*
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.id} {...getRowProps({ row })}>
									{row.cells.map((cell) =>
										cell.info.header === "detenido" ? (
											row.cells[4].value < 0 && !row.cells[5].value ? (
												<TableCell className="cds--table-column-menu">
													<IconButton
														size="sm"
														label="Detener"
														onClick={() => handleStopRow(row)}
													>
														<Error />
													</IconButton>
												</TableCell>
											) : (
												<TableCell>
													<IconButton size="sm" disabled></IconButton>
												</TableCell>
											)
										) : (
											<TableCell
												key={cell.id}
												style={
													cell.info.header === "tiempoRestante"
														? formatTimeRemaining(row).style
														: {}
												}
											>
												{cell.info.header === "tiempoRestante"
													? formatTimeRemaining(row).formattedTime
													: cell.info.header === "fecha"
													? formatTime(cell.value)
													: cell.info.header === "tiempoRentado"
													? `${cell.value} minuto(s)`
													: cell.value.toString()}
											</TableCell>
										)
									)}
								</TableRow>
							))}
						</TableBody>
					*/}
					</Table>
				</TableContainer>
			)}
		/>
	);
};

export default TablaTemporizador;
