import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	DataTable,
	IconButton,
	Button,
} from "@carbon/react";

import { useState } from "react";

import { useReceiptsStore } from "../store/appStore";

import { OverflowMenuHorizontal } from "@carbon/react/icons";

import { ArrowLeft, Printer } from "@carbon/react/icons";

const formatSimpleTime = (dateString) => {
	if (dateString !== null) {
		const datetime = new Date(dateString);

		const dayName = datetime.toLocaleString("es", { weekday: "long" });
		const monthName = datetime.toLocaleString("es", { month: "long" });

		const year = datetime.getFullYear();
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

		return ` ${day}/${monthName}/${year}, ${hour}:${minute} ${period}`;
	} else {
		return " ";
	}
};

const formatTime = (dateString) => {
	const datetime = new Date(dateString);

	const dayName = datetime.toLocaleString("es", { weekday: "long" });
	const monthName = datetime.toLocaleString("es", { month: "long" });

	const year = datetime.getFullYear();
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

	return `${dayName}, ${day}/${monthName}/${year}, ${hour}:${minute} ${period}`;
};

const receiptsHeaders = [
	{
		header: "Folio",
		key: "id",
	},
	{
		header: "Fecha",
		key: "fecha",
	},
	{
		header: "Total",
		key: "total",
	},
	{
		header: "Corte",
		key: "corteId",
	},
];

const receiptsDetailsHeaders = [
	{
		header: "Folio",
		key: "id",
	},

	{
		header: "Nombre",
		key: "nombre",
	},
	{
		header: "Descripcion",
		key: "descripcion",
	},
	{
		header: "Precio",
		key: "precio",
	},
	{
		header: "Cantidad",
		key: "cantidad",
	},
	{
		header: "Subtotal",
		key: "subtotal",
	},
];

const TablaRecibos = () => {
	const { printReceipt } = useReceiptsStore();

	const { receiptsRows } = useReceiptsStore((state) => ({
		receiptsRows: state.receiptsRows,
	}));

	const [receiptDetails, setReceiptDetails] = useState(false);
	const [openReceiptDetails, setOpenReceiptDetails] = useState(false);
	const [receiptInfo, setReceiptInfo] = useState();

	const handleReceiptsDetails = (row) => {
		const receiptRow = receiptsRows.find(
			(receiptRow) => receiptRow.id === row.id
		);

		if (receiptRow) {
			setOpenReceiptDetails(true);
			setReceiptInfo(receiptRow);
			setReceiptDetails(receiptRow.productos);
		} else {
			console.log("Row not found in receiptsRows.");
		}
	};

	const handleOnPrint = (id) => {
		printReceipt(id);
	};

	const reversedReceiptsRows = [...receiptsRows].reverse();

	return (
		<>
			{openReceiptDetails ? (
				<DataTable
					stickyHeader
					rows={receiptDetails}
					headers={receiptsDetailsHeaders}
					size="xl"
					render={({
						rows,
						headers,
						getHeaderProps,
						getRowProps,
						getTableProps,
					}) => (
						<TableContainer style={{ marginTop: "5px" }}>
							<div style={{ display: "flex" }}>
								<IconButton
									label="Regresar"
									onClick={() => setOpenReceiptDetails(false)}
								>
									<ArrowLeft></ArrowLeft>
								</IconButton>

								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										width: "100%",
										marginLeft: "25px",
										marginRight: "100px",
										marginTop: "10px",
										marginBottom: "10px",
										

									}}
								>
									<h1>Folio: {receiptInfo.id}</h1>
									
									<h4 style={{placeContent:"center",
										placeItems:"center"}}>
										{formatSimpleTime(receiptInfo.fecha)}
									</h4>
									<h1>
										Total:{" "}
										{receiptInfo.total.toLocaleString("es-MX", {
											style: "currency",
											currency: "MXN",
										})}
									</h1>
									<Button
										renderIcon={Printer}
										onClick={() => {
											handleOnPrint(receiptInfo.id);
										}}
									>
										Imprimir Ticket
									</Button>
								</div>
							</div>
							<Table
								{...getTableProps()}
								size="lg"
								useZebraStyles={false}
								aria-label="sample table"
							>
								<TableHead>
									<TableRow>
										{headers.map((header) => (
											<TableHeader
												key={header.key}
												{...getHeaderProps({
													header,
												})}
											>
												{header.header}
											</TableHeader>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map((row) => (
										<TableRow
											key={row.id}
											{...getRowProps({
												row,
											})}
										>
											{row.cells.map((cell) => (
												<TableCell key={cell.id}>
													{cell.info.header === "precio" ||
													cell.info.header === "subtotal"
														? cell.value.toLocaleString("es-MX", {
																style: "currency",
																currency: "MXN",
														  })
														: cell.value}
												</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				/>
			) : (
				<DataTable
					stickyHeader
					rows={reversedReceiptsRows}
					headers={receiptsHeaders}
					size="xl"
					render={({
						rows,
						headers,
						getHeaderProps,
						getRowProps,
						getTableProps,
					}) => (
						<TableContainer style={{ marginTop: "5px" }}>
							<Table
								{...getTableProps()}
								size="lg"
								useZebraStyles={false}
								aria-label="sample table"
							>
								<TableHead>
									<TableRow>
										{headers.map((header) => (
											<TableHeader
												key={header.key}
												{...getHeaderProps({
													header,
												})}
											>
												{header.header}
											</TableHeader>
										))}
										<TableHeader aria-label="overflow actions" />
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map((row) => (
										<TableRow
											key={row.id}
											{...getRowProps({
												row,
											})}
										>
											{row.cells.map((cell) => (
												<TableCell key={cell.id}>
													{cell.info.header === "total" &&
													cell.value !== undefined
														? cell.value.toLocaleString("es-MX", {
																style: "currency",
																currency: "MXN",
														  })
														: cell.info.header === "fecha" &&
														  cell.value !== undefined
														? formatTime(cell.value)
														: cell.value?.toString()}
												</TableCell>
											))}
											<TableCell className="cds--table-column-menu">
												<IconButton
													size="md"
													label="Detalles"
													onClick={() => handleReceiptsDetails(row)}
												>
													<OverflowMenuHorizontal />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					)}
				/>
			)}
		</>
	);
};

export default TablaRecibos;
