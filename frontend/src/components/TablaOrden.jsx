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
} from "@carbon/react";

import { useOrderStore } from "../store/appStore";

import { Subtract } from "@carbon/react/icons";

const TablaOrden = () => {
	const productsHeaders = [
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
		{
			header: "Cantidad",
			key: "cantidad",
		},
		{
			header: "Subtotal",
			key: "subtotal",
		},
	];

	const { productsOnOrder, total } = useOrderStore((state) => ({
		productsOnOrder: state.productsOnOrder,
		total: state.total,
	}));

	const { removeProductOnOrder } = useOrderStore();

	const handleRemoveProductToOrder = (row) => {
		const productToRemove = productsOnOrder.find(
			(product) => product.id === row.id
		);
		

		if (productToRemove) {
			removeProductOnOrder(productToRemove);
		} else {
			console.log("Product not found in productsRows.");
		}
	};

	return (
		<>
			<div style={{ margin: "0px", padding: "0px", display: "grid" }}>
				<h1>
					Total{" "}
					{total.toLocaleString("es-MX", {
						style: "currency",
						currency: "MXN",
					})}
				</h1>
			</div>
			<DataTable
				stickyHeader
				rows={productsOnOrder}
				headers={productsHeaders}
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
												{cell.info.header === "precio" ||
												cell.info.header === "subtotal"
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
												label="Quitar"
												onClick={() => handleRemoveProductToOrder(row)}
												kind="danger--ghost"
											>
												<Subtract />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			/>
		</>
	);
};

export default TablaOrden;
