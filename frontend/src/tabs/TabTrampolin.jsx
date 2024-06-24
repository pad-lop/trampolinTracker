import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableHeader,
	TableRow,
	TableToolbar,
	TableToolbarContent,
	TableToolbarSearch,
	DataTable,
	OverflowMenu,
	OverflowMenuItem,
	Button,
	IconButton,
	FormGroup,
	TextInput,
} from "@carbon/react";

import { useCatalogueStore } from "../store/appStore";

import { useState, useMemo } from "react";

import { Add, ArrowLeft } from "@carbon/react/icons";

const TabProductos = () => {
	const productsHeaders = [
		{
			header: "Nombre",
			key: "nombre",
		},
		{
			header: "Tiempo",
			key: "tiempo",
		},
		{
			header: "Precio",
			key: "precio",
		},
	];

	const formatPrecio = (numericValue) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
		}).format(parseFloat(numericValue) / 100);
	};

	const deformatPrecio = (formattedPrecio) => {
		const numericValue = formattedPrecio.replace(/[$,]/g, "");
		return parseFloat(numericValue);
	};

	const { searchTerm, setSearchTerm, services } = useCatalogueStore();
	const filteredRows = useMemo(() => {
		return services.filter((row) =>
			row.tiempo.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [services, searchTerm]);

	const handleServiceSearch = (term) => {
		setSearchTerm(term);
	};

	const createService = useCatalogueStore((state) => state.createService);
	const editService = useCatalogueStore((state) => state.editService);
	const deleteService = useCatalogueStore((state) => state.deleteService);

	const handleCreateService = () => {
		const floatPrecio = deformatPrecio(precio);
		createService(tiempo, floatPrecio);
		setTiempo("");
		setPrecio("");
		setOpenAddService(false);
	};

	const handleEditarService = () => {
		const floatPrecio = deformatPrecio(precio);
		editService(id, tiempo, floatPrecio);
		setId("");
		setTiempo("");
		setPrecio("");
		setOpenAddService(false);
	};

	const [openAddService, setOpenAddService] = useState(false);

	const [editingService, setEditingService] = useState(false);

	const [id, setId] = useState("");
	const [tiempo, setTiempo] = useState("");
	const [precio, setPrecio] = useState(formatPrecio(0));

	const handleNameChange = (event) => {
		const inputValue = event.target.value;
		const numericValue = inputValue.replace(/[^0-9]/g, "");
		setTiempo(numericValue);
	};

	const handlePrecioChange = (event) => {
		const inputValue = event.target.value;

		const numericValue = inputValue.replace(/[^0-9]/g, "");

		const formattedValue = formatPrecio(numericValue);

		setPrecio(formattedValue);
	};

	const handleOpenEditService = (row) => {
		const serviceToEdit = services.find((service) => service.id === row.id);

		setOpenAddService(true);
		setEditingService(true);

		setId(serviceToEdit.id);
		setTiempo(serviceToEdit.tiempo);

		const formattedValue = formatPrecio(serviceToEdit.precio * 100);
		setPrecio(formattedValue);
	};

	const handleDeleteService = (row) => {
		const serviceToEdit = services.find((service) => service.id === row.id);
		deleteService(serviceToEdit.id);
	};

	const handleGoBack = () => {
		setId("");
		setTiempo("");
		setPrecio(formatPrecio(0));
		setEditingService(false);
		setOpenAddService(false);
	};

	return (
		<>
			{openAddService ? (
				<>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							marginBottom: "5px",
							marginTop: "5px",
						}}
					>
						<IconButton
							title="Regresar"
							label="Regresar"
							onClick={() => handleGoBack()}
							style={{ marginRight: "15px" }}
						>
							<ArrowLeft></ArrowLeft>
						</IconButton>
						{editingService ? (
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
									marginLeft: "25px",
									marginRight: "250px",
								}}
							>
								<h1> Editar Servicio</h1>
								<h1> ID: {id}</h1>
							</div>
						) : (
							<h1> Agregar Tiempo </h1>
						)}
					</div>

					<FormGroup legendText="">
						<TextInput
							style={{ marginBottom: "5px" }}
							id="tiempoServicio-input"
							type="text"
							required
							labelText="Tiempo"
							value={tiempo}
							onChange={handleNameChange}
						/>
						<TextInput
							style={{ marginBottom: "5px" }}
							id="precioServicio-input"
							type="text"
							labelText="Precio"
							required
							value={precio}
							onChange={handlePrecioChange}
						></TextInput>

						{editingService ? (
							<Button
								style={{ marginBottom: "5px" }}
								type="submit"
								id="buttonVentaAgregar"
								renderIcon={Add}
								onClick={() => {
									handleEditarService();
								}}
								kind="tertiary"
							>
								Editar
							</Button>
						) : (
							<Button
								style={{ marginBottom: "5px" }}
								type="submit"
								id="buttonVentaAgregar"
								renderIcon={Add}
								onClick={() => {
									handleCreateService();
								}}
								kind="tertiary"
							>
								Añadir
							</Button>
						)}
					</FormGroup>
				</>
			) : (
				<DataTable
					stickyHeader
					rows={filteredRows}
					headers={productsHeaders}
					render={({
						rows,
						headers,
						getHeaderProps,
						getRowProps,
						getTableProps,
					}) => (
						<TableContainer style={{ marginTop: "0px" }}>
							<TableToolbar aria-label="data table toolbar">
								<TableToolbarContent>
									<TableToolbarSearch
										onChange={(event) =>
											handleServiceSearch(event.target.value)
										}
										persistent
									/>
									<Button
										onClick={() => {
											setOpenAddService(true);
										}}
										renderIcon={Add}
									>
										Agregar
									</Button>
								</TableToolbarContent>
							</TableToolbar>

							<Table {...getTableProps()} aria-label="sample table">
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
													{cell.info.header === "precio"
														? cell.value.toLocaleString("es-MX", {
																style: "currency",
																currency: "MXN",
														  })
														: cell.info.header === "tiempo"
														? cell.value + " minuto(s)"
														: cell.value}
												</TableCell>
											))}

											<TableCell className="cds--table-column-menu">
												<OverflowMenu size="md" flipped>
													<OverflowMenuItem
														itemText="Editar"
														onClick={() => {
															handleOpenEditService(row);
														}}
													/>
													<OverflowMenuItem
														isDelete
														itemText="Eliminar"
														onClick={() => {
															handleDeleteService(row);
														}}
													/>
												</OverflowMenu>
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

export default TabProductos;
