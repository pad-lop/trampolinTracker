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

import { useMemo, useState } from "react";

import { Add, ArrowLeft } from "@carbon/react/icons";

const TabProductos = () => {
	const { searchTerm, setSearchTerm, productsRows } = useCatalogueStore();

	const filteredRows = useMemo(() => {
		return productsRows.filter((row) =>
			row.producto.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [productsRows, searchTerm]);

	const handleProductSearch = (term) => {
		setSearchTerm(term);
	};

	const productsHeaders = [
		{
			header: "ID",
			key: "id",
		},
		{
			header: "Producto",
			key: "producto",
		},

		{
			header: "Descripcion",
			key: "descripcion",
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

	const createProduct = useCatalogueStore((state) => state.createProduct);
	const editProduct = useCatalogueStore((state) => state.editProduct);
	const deleteProduct = useCatalogueStore((state) => state.deleteProduct);

	const handleCreateProduct = () => {
		const floatPrecio = deformatPrecio(precio);
		createProduct(name, descripcion, floatPrecio, "Producto");
		setName("");
		setDescripcion("");
		setPrecio("");
		setOpenAddProduct(false);
	};

	const handleEditarProduct = () => {
		const floatPrecio = deformatPrecio(precio);
		editProduct(id, name, descripcion, floatPrecio, "Producto");
		setId("");
		setName("");
		setDescripcion("");
		setPrecio("");
		setOpenAddProduct(false);
	};

	const [openAddProduct, setOpenAddProduct] = useState(false);

	const [editingProduct, setEditingProduct] = useState(false);

	const [id, setId] = useState("");
	const [name, setName] = useState("");
	const [descripcion, setDescripcion] = useState("");
	const [precio, setPrecio] = useState(formatPrecio(0));

	const handleNameChange = (event) => {
		const inputValue = event.target.value;
		const formattedValue = inputValue.replace(/(^|\s)\w/g, (char) =>
			char.toUpperCase()
		);
		setName(formattedValue);
	};

	const handleDescripcionChange = (event) => {
		const inputValue = event.target.value;
		const formattedValue = inputValue.replace(/(^|\s)\w/g, (char) =>
			char.toUpperCase()
		);
		setDescripcion(formattedValue);
	};

	const handlePrecioChange = (event) => {
		const inputValue = event.target.value;

		const numericValue = inputValue.replace(/[^0-9]/g, "");

		const formattedValue = formatPrecio(numericValue);

		setPrecio(formattedValue);
	};

	const handleOpenEditProduct = (row) => {
		const productToEdit = productsRows.find((product) => product.id === row.id);

		setOpenAddProduct(true);
		setEditingProduct(true);

		setId(productToEdit.id);
		setName(productToEdit.producto);
		setDescripcion(productToEdit.descripcion);

		const formattedValue = formatPrecio(productToEdit.precio * 100);
		setPrecio(formattedValue);
	};

	const handleDeleteProduct = (row) => {
		const productToEdit = productsRows.find((product) => product.id === row.id);
		deleteProduct(parseInt(productToEdit.id, 10));
	};

	const handleGoBack = () => {
		setId("");
		setName("");
		setDescripcion("");
		setPrecio(formatPrecio(0));
		setEditingProduct(false);
		setOpenAddProduct(false);
	};

	return (
		<>
			{openAddProduct ? (
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
						{editingProduct ? (
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
									marginRight: "150px",
								}}
							>
								<h1> Editar Producto</h1>
								<h1> ID: {id}</h1>
							</div>
						) : (
							<h1> Agregar Producto </h1>
						)}
					</div>

					<FormGroup legendText="">
						<TextInput
							style={{ marginBottom: "5px" }}
							id="nombreProducto-input"
							type="text"
							required
							labelText="Nombre"
							value={name}
							onChange={handleNameChange}
						/>
						<TextInput
							style={{ marginBottom: "5px" }}
							id="descripcionProducto-input"
							type="text"
							required
							labelText="Descripcion"
							value={descripcion}
							onChange={handleDescripcionChange}
						/>
						<TextInput
							style={{ marginBottom: "5px" }}
							id="precioProducto-input"
							type="text"
							labelText="Precio"
							required
							value={precio}
							onChange={handlePrecioChange}
						></TextInput>

						{editingProduct ? (
							<Button
								style={{ marginBottom: "5px" }}
								type="submit"
								id="buttonVentaAgregar"
								renderIcon={Add}
								onClick={() => {
									handleEditarProduct();
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
									handleCreateProduct();
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
											handleProductSearch(event.target.value)
										}
										persistent
									/>
									<Button
										onClick={() => {
											setOpenAddProduct(true);
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
														: cell.value}
												</TableCell>
											))}

											<TableCell className="cds--table-column-menu">
												<OverflowMenu size="md" flipped>
													<OverflowMenuItem
														itemText="Editar"
														onClick={() => {
															handleOpenEditProduct(row);
														}}
													/>
													<OverflowMenuItem
														isDelete
														itemText="Eliminar"
														onClick={() => {
															handleDeleteProduct(row);
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
