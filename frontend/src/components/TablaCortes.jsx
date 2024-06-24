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
	TableToolbar,
	TableToolbarContent,
	Button,
	FormGroup,
	DatePicker,
	DatePickerInput,
	TextInput,
	NumberInput,
	Grid,
	Column,
} from "@carbon/react";

import { useState, useEffect } from "react";

import { useCortesStore } from "../store/appStore";

import {
	OverflowMenuHorizontal,
	Printer,
	TextAlignCenter,
	TextAlignJustify,
} from "@carbon/react/icons";

import { ArrowLeft, Add } from "@carbon/react/icons";

const formatCurrency = (value) => {
	return value.toLocaleString("es-MX", {
		style: "currency",
		currency: "MXN",
	});
};

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

const cortesHeaders = [
	{
		header: "Folio",
		key: "id",
	},
	{
		header: "Estado",
		key: "estado",
	},
	{
		header: "Fecha Inicio",
		key: "fechaInicio",
	},
	{
		header: "Fecha Final",
		key: "fechaFinal",
	},

	{
		header: "Folio Inicio",
		key: "folioInicial",
	},
	{
		header: "Folio Final",
		key: "folioFinal",
	},
	{
		header: "Fondo Inicio",
		key: "fondoInicio",
	},
	{
		header: "Fondo Final",
		key: "fondoFinal",
	},
	{
		header: "Efectivo",
		key: "efectivoTotal",
	},
	{
		header: "Recibos",
		key: "recibosTotal",
	},
];

const cortesDetailsHeaders = [
	{
		header: "Folio",
		key: "id",
	},
];
const TablaCortes = () => {
	const fetchLastOpenCorte = useCortesStore(
		(state) => state.fetchLastOpenCorte
	);

	const cortesRows = useCortesStore((state) => state.cortesRows);
	const openCorte = useCortesStore((state) => state.openCorte);
	const closeCorte = useCortesStore((state) => state.closeCorte);
	const fetchCortes = useCortesStore((state) => state.fetchCortes);

	const [grandTotal, setGrandTotal] = useState(0);

	const [lastOpenCorte, setLastOpenCorte] = useState(null);

	const [openAddCorte, setOpenAddCorte] = useState(false);
	const [openCloseCorte, setOpenCloseCorte] = useState(false);

	const [corteDetails, setCorteDetail] = useState([]);
	const [openCorteDetail, setOpenCorteDetail] = useState(false);
	const [corteInfo, setCorteInfo] = useState({});

	const checkLastOpenCorte = async () => {
		const lastOpen = await fetchLastOpenCorte();
		setLastOpenCorte(lastOpen);
	};


	useEffect(() => {
		checkLastOpenCorte();
		fetchCortes();
	}, [openAddCorte, openCloseCorte]);

	const handleCorteDetail = (row) => {
		const receiptRow = cortesRows.find(
			(receiptRow) => receiptRow.id === row.id
		);
		if (receiptRow) {
			setOpenCorteDetail(true);
			setCorteInfo(receiptRow);
			setCorteDetail(receiptRow.recibos);
		} else {
			console.log("Row not found in receiptsRows.");
		}
	};

	const handleAbrirCorte = (grandTotal) => {
		setOpenAddCorte(false);
		openCorte({ fondoInicio: grandTotal });
		checkLastOpenCorte()
	};

	const handleCerrarCorte = async (
		fondoFinal,
		receipts,
		efectivoTotal,
		recibosTotal
	) => {
		checkLastOpenCorte()

		if (receipts.length === 0) {
			console.log("Error: Cannot close corte without receipts.");
			return;
		}

		const folioInicial = receipts[0].id;
		const folioFinal = receipts[receipts.length - 1].id;

		const corteData = {
			recibos: receipts,
			fondoFinal: fondoFinal,
			folioInicial,
			folioFinal,
			efectivoTotal,
			recibosTotal,
		};

		try {
			await closeCorte(corteData);
			setOpenCloseCorte(false);
		} catch (error) {
			console.error(error);
		}
	};

	const reversedCortesRows = [...cortesRows].reverse();
	const { printCorte } = useCortesStore();

	const handleOnPrint = (id) => {
		printCorte(id);
	};

	return (
		<>
			{openCorteDetail ? (
				<CorteDetail
					corteDetails={corteDetails}
					setOpenCorteDetail={setOpenCorteDetail}
					corteInfo={corteInfo}
					handleOnPrint={handleOnPrint}
				/>
			) : openAddCorte ? (
				<AddCorte
					setOpenAddCorte={setOpenAddCorte}
					handleAbrirCorte={handleAbrirCorte}
					setGrandTotal={setGrandTotal}
					grandTotal={grandTotal}
				/>
			) : openCloseCorte ? (
				<CloseCorte
					setOpenCloseCorte={setOpenCloseCorte}
					handleCerrarCorte={handleCerrarCorte}
					lastOpenCorte={lastOpenCorte}
					setGrandTotal={setGrandTotal}
					grandTotal={grandTotal}
				/>
			) : (
				<Cortes
					cortesRows={reversedCortesRows}
					fetchCortes={fetchCortes}
					setOpenAddCorte={setOpenAddCorte}
					setOpenCloseCorte={setOpenCloseCorte}
					handleCorteDetail={handleCorteDetail}
					lastOpenCorte={lastOpenCorte}
				/>
			)}
		</>
	);
};

const Cortes = ({
	cortesRows,
	setOpenAddCorte,
	handleCorteDetail,
	lastOpenCorte,
	fetchCortes,
	setOpenCloseCorte,
}) => {
	return (
		<DataTable
			rows={cortesRows}
			headers={cortesHeaders}
			size="xl"
			render={({
				rows,
				headers,
				getHeaderProps,
				getRowProps,
				getTableProps,
			}) => (
				<TableContainer style={{ marginTop: "5px" }}>
					<TableToolbar aria-label="data table toolbar">
						<TableToolbarContent
							style={{ marginBottom: "10px", marginTop: "10px" }}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
									marginLeft: "25px",
									marginRight: "25px",
								}}
							>
								<h1>Historial Cortes </h1>

								{lastOpenCorte ? (
									<Button
										onClick={() => {
											setOpenCloseCorte(true);
										}}
										renderIcon={Add}
									>
										Cerrar Corte
									</Button>
								) : (
									<Button
										onClick={() => {
											setOpenAddCorte(true);
										}}
										renderIcon={Add}
									>
										Abrir Corte
									</Button>
								)}
							</div>
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
											{cell.info.header === "estado" ? (
												<span
													style={{
														color:
															cell.value.toLowerCase() === "cerrado"
																? "green"
																: "red",
													}}
												>
													{cell.value.replace(/(^|\s)\w/g, (char) =>
														char.toUpperCase()
													)}
												</span>
											) : cell.info.header === "fechaInicio" ? (
												formatSimpleTime(cell.value)
											) : cell.info.header === "fechaFinal" ? (
												formatSimpleTime(cell.value)
											) : cell.info.header === "recibosTotal" &&
											  cell.value !== null ? (
												formatCurrency(cell.value)
											) : cell.info.header === "efectivoTotal" &&
											  cell.value !== null ? (
												formatCurrency(cell.value)
											) : cell.info.header === "fondoInicio" ? (
												formatCurrency(cell.value)
											) : cell.info.header === "fondoFinal" &&
											  cell.value !== null ? (
												formatCurrency(cell.value)
											) : (
												cell.value?.toString()
											)}
										</TableCell>
									))}

									{row.cells[1].value === "cerrado" && (
										<TableCell className="cds--table-column-menu">
											<IconButton
												size="md"
												label="Detalles"
												onClick={() => handleCorteDetail(row)}
											>
												<OverflowMenuHorizontal />
											</IconButton>
										</TableCell>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		/>
	);
};

const CorteDetail = ({ corteDetails, setOpenCorteDetail, corteInfo, handleOnPrint }) => {
	const inputStyle = {
		textAlign: "center",
	};

	const total1 = corteInfo.recibosTotal + corteInfo.fondoInicio;
	const total2 = corteInfo.efectivoTotal + corteInfo.fondoFinal;
	const diferencia = total1 - total2;
	const diferenciaMayorA10 = Math.abs(diferencia) > 0;

	return (
		<>
			<div>
				<div style={{ display: "flex" }}>
					<IconButton
						label="Regresar"
						onClick={() => setOpenCorteDetail(false)}
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
						}}
					>
						<h1>Corte #{corteInfo.id} </h1>
						<Button
										renderIcon={Printer}
										onClick={() => {
											handleOnPrint(corteInfo.id);
										}}
									>
										Imprimir Corte
									</Button>
					</div>
				</div>

				<FormGroup>
					<div style={{ marginTop: "10px" }}></div>

					<Grid>
						<Column sm={1} md={4} lg={8}>
							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={inputStyle}>Fecha Inicio</h5>
								</Column>
								<Column sm={1} md={2} lg={4}>
									<TextInput
										value={formatSimpleTime(corteInfo.fechaInicio)}
										readOnly
										style={inputStyle}
									/>
								</Column>
							</Grid>
							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={inputStyle}>Fecha Final</h5>
								</Column>
								<Column sm={1} md={2} lg={4}>
									<TextInput
										value={formatSimpleTime(corteInfo.fechaFinal)}
										readOnly
										style={inputStyle}
									/>
								</Column>
							</Grid>
							<div style={{ marginTop: "20px" }}></div>
							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={inputStyle}>Efectivo</h5>
								</Column>
								<Column sm={1} md={2} lg={4}>
									<TextInput
										value={formatCurrency(corteInfo.efectivoTotal)}
										readOnly
										style={inputStyle}
									/>
								</Column>
							</Grid>

							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Fondo Final</h5>
								</Column>
								<Column sm={1} md={2} lg={4}>
									<TextInput
										value={formatCurrency(corteInfo.fondoFinal)}
										readOnly
										style={inputStyle}
									/>
								</Column>
							</Grid>

							<div style={{ marginTop: "5px" }}></div>
							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Total</h5>
								</Column>
								<Column sm={1} md={2} lg={4}>
									<TextInput
										value={formatCurrency(total2)}
										readOnly
										style={inputStyle}
									/>
								</Column>
							</Grid>
							<div style={{ marginTop: "20px" }}></div>

							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Recibos</h5>
								</Column>
								<Column sm={1} md={2} lg={4}>
									<TextInput
										value={formatCurrency(corteInfo.recibosTotal)}
										readOnly
										style={inputStyle}
									/>
								</Column>
							</Grid>

							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Fondo Inicio</h5>
								</Column>
								<Column sm={1} md={2} lg={4}>
									<TextInput
										value={formatCurrency(corteInfo.fondoInicio)}
										readOnly
										style={inputStyle}
									/>
								</Column>
							</Grid>
							<div style={{ marginTop: "5px" }}></div>

							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Total</h5>
								</Column>
								<Column sm={1} md={2} lg={4}>
									<TextInput
										readOnly
										value={formatCurrency(total1)}
										style={inputStyle}
									/>
								</Column>
							</Grid>
							<div style={{ marginTop: "20px" }}></div>
							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Diferencia</h5>
								</Column>
								<Column sm={1} md={2} lg={4}>
									<TextInput
										value={formatCurrency(diferencia)}
										readOnly
										style={{
											...inputStyle,
											color: diferenciaMayorA10 ? "red" : "inherit",
										}}
									/>
								</Column>
							</Grid>
						</Column>

						<Column sm={1} md={4} lg={8}>
							<div style={{ marginTop: "20px" }}></div>

							<h3 style={{ textAlign: "center" }}>Resumen de Recibos</h3>
							<DataTable
								stickyHeader
								rows={corteDetails}
								headers={[
									{ key: "id", header: "ID" },
									{ key: "fecha", header: "Fecha" },
									{ key: "total", header: "Total" },
								]}
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
																{cell.info.header === "fecha"
																	? formatSimpleTime(cell.value)
																	: cell.info.header === "total"
																	? formatCurrency(cell.value)
																	: cell.value?.toString()}
															</TableCell>
														))}
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								)}
							/>
						</Column>
					</Grid>
					<div style={{ marginBottom: "5px" }}></div>

					<div style={{ marginBottom: "20px" }}></div>
				</FormGroup>
			</div>
		</>
	);
};

const AddCorte = ({
	setOpenAddCorte,
	handleAbrirCorte,
	setGrandTotal,
	grandTotal,
}) => {
	return (
		<div>
			<div style={{ display: "flex" }}>
				<IconButton label="Regresar" onClick={() => setOpenAddCorte(false)}>
					<ArrowLeft></ArrowLeft>
				</IconButton>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						width: "100%",
						marginLeft: "25px",
						marginRight: "100px",
					}}
				>
					<h1>Iniciar Corte </h1>
				</div>
			</div>

			<FormGroup>
				<CashAccountingGrid
					handleAbrirCorte={handleAbrirCorte}
					setGrandTotal={setGrandTotal}
					grandTotal={grandTotal}
				></CashAccountingGrid>
			</FormGroup>
		</div>
	);
};

function CashAccountingGrid({ handleAbrirCorte, setGrandTotal, grandTotal }) {
	const [quantities, setQuantities] = useState(Array(11).fill(""));

	const denominations = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

	const handleQuantityChange = (index, event) => {
		const inputValue = event.target.value;

		const numericValue = inputValue.replace(/[^0-9]/g, "");

		const updatedQuantities = [...quantities];

		updatedQuantities[index] = numericValue;

		setQuantities(updatedQuantities);
	};

	const calculateTotal = (index) => {
		const quantity = parseFloat(quantities[index]) || 0;
		return quantity * denominations[index];
	};
	const formatCurrency = (value) => {
		return value.toLocaleString("es-MX", {
			style: "currency",
			currency: "MXN",
		});
	};

	const calculateGrandTotal = () => {
		const total = quantities.reduce(
			(total, quantity, index) => total + calculateTotal(index),
			0
		);
		setGrandTotal(total);
		return total;
	};

	const inputStyle = {
		textAlign: "center",
	};

	const formatQuantity = (numericValue) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
		}).format(parseFloat(numericValue) / 100);
	};

	return (
		<>
			<div style={{ marginTop: "10px" }}></div>

			<Grid>
				<Column sm={1} md={2} lg={4}>
					<h4 style={inputStyle}>Cantidad</h4>
					{quantities.map((quantity, index) => (
						<TextInput
							key={index}
							value={quantity}
							onChange={(e) => handleQuantityChange(index, e)}
							style={inputStyle}
							type="number"
						/>
					))}
				</Column>
				<Column sm={1} md={2} lg={4}>
					<h4 style={inputStyle}>Monto</h4>
					{denominations.map((denomination, index) => (
						<TextInput
							key={index}
							value={formatCurrency(denomination)}
							readOnly
							style={inputStyle}
						/>
					))}
				</Column>
				<Column sm={1} md={2} lg={4}>
					<h4 style={inputStyle}>Suma</h4>
					{quantities.map((_, index) => (
						<TextInput
							key={index}
							value={formatCurrency(calculateTotal(index))}
							readOnly
							style={inputStyle}
						/>
					))}
				</Column>

				<Column sm={1} md={2} lg={4}>
					<h4 style={inputStyle}>Total</h4>
					<TextInput
						value={formatCurrency(calculateGrandTotal())}
						readOnly
						style={inputStyle}
					/>
					<Button
						style={{ marginBottom: "5px" }}
						type="submit"
						id="buttonVentaAgregar"
						renderIcon={Add}
						onClick={() => {
							handleAbrirCorte(grandTotal);
						}}
						kind="tertiary"
					>
						Añadir Fondo
					</Button>
				</Column>
				<div style={{ marginBottom: "20px" }}></div>
			</Grid>
		</>
	);
}

const CloseCorte = ({
	setOpenCloseCorte,
	handleCerrarCorte,
	lastOpenCorte,
	setGrandTotal,
	grandTotal,
}) => {
	const [quantities, setQuantities] = useState(Array(11).fill(""));

	const denominations = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5];

	const [fondoFinal, setFondoFinal] = useState(0);

	const handleQuantityChange = (index, event) => {
		const inputValue = event.target.value;

		const numericValue = inputValue.replace(/[^0-9]/g, "");

		const updatedQuantities = [...quantities];

		updatedQuantities[index] = numericValue;

		setQuantities(updatedQuantities);
	};

	const handleFondoFinalChange = (event) => {
		const inputValue = event.target.value;

		const numericValue = inputValue.replace(/[^0-9]/g, "");
		const formattedValue = formatPrecio(numericValue);
		setFondoFinal(formattedValue);
	};

	const formatPrecio = (numericValue) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
		}).format(parseFloat(numericValue) / 100);
	};

	const calculateTotal = (index) => {
		const quantity = parseFloat(quantities[index]) || 0;
		return quantity * denominations[index];
	};

	const formatCurrency = (value) => {
		return value.toLocaleString("es-MX", {
			style: "currency",
			currency: "MXN",
		});
	};

	const calculateGrandTotal = () => {
		const total = quantities.reduce(
			(total, quantity, index) => total + calculateTotal(index),
			0
		);
		setGrandTotal(total);
		return total;
	};

	const inputStyle = {
		textAlign: "center",
	};

	const formatQuantity = (numericValue) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
		}).format(parseFloat(numericValue) / 100);
	};

	const [receipts, setReceipts] = useState([]);
	const fetchReceiptsByDate = useCortesStore(
		(state) => state.fetchReceiptsByDate
	);

	useEffect(() => {
		const fetchReceipts = async () => {
			const startDate = new Date(lastOpenCorte.fechaInicio); // Set the desired start date
			const fetchedReceipts = await fetchReceiptsByDate(startDate);
			setReceipts(fetchedReceipts);
		};

		fetchReceipts();
	}, [fetchReceiptsByDate]);

	const [totalRecibos, setTotalRecibos] = useState(0);
	const calculateTotalRecibos = () => {
		const total = receipts.reduce((sum, receipt) => sum + receipt.total, 0);
		setTotalRecibos(total);
	};
	useEffect(() => {
		calculateTotalRecibos();
	}, [receipts]);

	const deformatPrecio = (value) => {
		if (typeof value === "string") {
			const numericValue = value.replace(/[$,]/g, "");
			return parseFloat(numericValue);
		}
		return value;
	};
	const diferencia =
		deformatPrecio(grandTotal) +
		deformatPrecio(fondoFinal) -
		(totalRecibos + lastOpenCorte.fondoInicio);

	const diferenciaMayorA10 = Math.abs(diferencia) > 0;

	return (
		<>
			<div>
				<div style={{ display: "flex" }}>
					<IconButton label="Regresar" onClick={() => setOpenCloseCorte(false)}>
						<ArrowLeft></ArrowLeft>
					</IconButton>

					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							width: "100%",
							marginLeft: "25px",
							marginRight: "100px",
						}}
					>
						<h1>Cerrar Corte </h1>
					</div>
				</div>

				<FormGroup>
					<div style={{ marginTop: "10px" }}></div>

					<Grid>
						<Column sm={1} md={1} lg={2}>
							<h4 style={inputStyle}>Cantidad</h4>
							{quantities.map((quantity, index) => (
								<TextInput
									key={index}
									value={quantity}
									onChange={(e) => handleQuantityChange(index, e)}
									style={inputStyle}
								/>
							))}
						</Column>
						<Column sm={1} md={1} lg={2}>
							<h4 style={inputStyle}>Monto</h4>
							{denominations.map((denomination, index) => (
								<TextInput
									key={index}
									value={formatCurrency(denomination)}
									readOnly
									style={inputStyle}
								/>
							))}
						</Column>
						<Column sm={1} md={1} lg={2}>
							<h4 style={inputStyle}>Suma</h4>
							{quantities.map((_, index) => (
								<TextInput
									key={index}
									value={formatCurrency(calculateTotal(index))}
									readOnly
									style={inputStyle}
								/>
							))}
						</Column>
						<Column sm={1} md={5} lg={10}>
							<h3 style={{ textAlign: "center" }}>Resumen de Recibos</h3>
							<DataTable
								stickyHeader
								rows={receipts}
								headers={[
									{ key: "id", header: "ID" },
									{ key: "fecha", header: "Fecha" },
									{ key: "total", header: "Total" },
								]}
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
																{cell.info.header === "fecha"
																	? formatSimpleTime(cell.value)
																	: cell.info.header === "total"
																	? formatCurrency(cell.value)
																	: cell.value?.toString()}
															</TableCell>
														))}
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								)}
							/>
							<div style={{ marginTop: "50px" }}></div>
							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Total Recibos</h5>
								</Column>
								<Column sm={1} md={2} lg={6}>
									<TextInput
										value={formatCurrency(totalRecibos)}
										readOnly
										style={inputStyle}
									/>
								</Column>
							</Grid>

							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Fondo Inicio</h5>
								</Column>
								<Column sm={1} md={2} lg={6}>
									<TextInput
										value={formatCurrency(lastOpenCorte.fondoInicio)}
										readOnly
										style={inputStyle}
									/>
								</Column>
							</Grid>

							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Total</h5>
								</Column>
								<Column sm={1} md={2} lg={6}>
									<TextInput
										readOnly
										value={formatCurrency(
											totalRecibos + lastOpenCorte.fondoInicio
										)}
										style={inputStyle}
									/>
								</Column>
							</Grid>
							<Grid>
								<Column sm={1} md={2} lg={4}>
									<h5 style={{ textAlign: "center" }}>Diferencia</h5>
								</Column>
								<Column sm={1} md={2} lg={6}>
									<TextInput
										value={formatCurrency(diferencia)}
										readOnly
										style={{
											...inputStyle,
											color: diferenciaMayorA10 ? "red" : "inherit",
										}}
									/>
								</Column>
							</Grid>
						</Column>
					</Grid>
					<div style={{ marginBottom: "5px" }}></div>

					<Grid>
						<Column sm={1} md={1} lg={2}>
							<h5 style={inputStyle}>Efectivo</h5>
						</Column>
						<Column sm={1} md={2} lg={4}>
							<TextInput
								value={formatCurrency(calculateGrandTotal())}
								readOnly
								style={inputStyle}
							/>
						</Column>
					</Grid>

					<Grid>
						<Column sm={1} md={1} lg={2}>
							<h5 style={{ textAlign: "center" }}>Fondo Final</h5>
						</Column>
						<Column sm={1} md={2} lg={4}>
							<TextInput
								value={formatCurrency(fondoFinal)}
								onChange={(e) => {
									handleFondoFinalChange(e);
								}}
								style={inputStyle}
							/>
						</Column>
						<Column sm={2} md={4} lg={10}>
							<div
								style={{
									display: "grid",
									placeItems: "center",
									placeContent: "center",
								}}
							>
								<Button
									onClick={() => {
										handleCerrarCorte(
											deformatPrecio(fondoFinal),
											receipts,
											calculateGrandTotal(),
											totalRecibos
										);
									}}
								>
									Cerrar Corte
								</Button>
							</div>
						</Column>
					</Grid>

					<Grid>
						<Column sm={1} md={1} lg={2}>
							<h5 style={{ textAlign: "center" }}>Total</h5>
						</Column>
						<Column sm={1} md={2} lg={4}>
							<TextInput
								value={formatCurrency(
									deformatPrecio(grandTotal) + deformatPrecio(fondoFinal)
								)}
								readOnly
								style={inputStyle}
							/>
						</Column>
					</Grid>

					<div style={{ marginBottom: "20px" }}></div>
				</FormGroup>
			</div>
		</>
	);
};

export default TablaCortes;
