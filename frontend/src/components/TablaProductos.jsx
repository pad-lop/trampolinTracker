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
	IconButton,
} from "@carbon/react";

import { useCatalogueStore, useOrderStore } from "../store/appStore";

import { Add } from "@carbon/react/icons";

import { useMemo, useState } from "react";

const TablaProductos = () => {
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
			header: "Precio",
			key: "precio",
		},
	];

	

	const { addProductOnOrder } = useOrderStore();

	const handleAddProductToOrder = (row) => {
		const productToAdd = productsRows.find((product) => product.id === row.id);

		if (productToAdd) {
			addProductOnOrder(productToAdd);
		} else {
			console.log("Product not found in productsRows.");
		}
	};

	return (
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
				<TableContainer style={{ marginTop: "15px", marginBottom: "15px" }}>
					<TableToolbar aria-label="data table toolbar">
						<TableToolbarContent>
							<TableToolbarSearch
								value={searchTerm}
								onChange={(event) => handleProductSearch(event.target.value)}
							/>
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
										<IconButton
											size="md"
											onClick={() => handleAddProductToOrder(row)}
											label="Añadir"
											kind="ghost"
										>
											<Add></Add>
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		/>
	);
};

export default TablaProductos;
