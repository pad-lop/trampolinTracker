import { useState } from "react";
import {
	Header,
	HeaderName,
	HeaderGlobalBar,
	HeaderGlobalAction,
	SkipToContent,
	Button,
	Modal,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	TextInput,
	FormGroup,
	Grid,
	Column,
} from "@carbon/react";
import {
	Add,
	Settings,
	Receipt,
	Product,
	Time,
	Money,
	ArrowLeft,
	User,
} from "@carbon/icons-react";

import TablaOrden from "./components/TablaOrden";
import TablaProductos from "./components/TablaProductos";
import FormularioOrden from "./components/FormularioOrden";
import TablaTemporizador from "./components/TablaTemporizador";
import TablaRecibos from "./components/TablaRecibos";
import TablaCortes from "./components/TablaCortes";
import { useOrderStore, useReceiptsStore } from "./store/appStore";
import TabProductos from "./tabs/TabProductos";
import TabTrampolin from "./tabs/TabTrampolin";
import { useCatalogueStore, useCortesStore } from "./store/appStore";

import { useEffect } from "react";
import "./index.scss";

import Login from "./Login";
import CatalogueLogin from "./CatalogueLogin";
import TabUsers from "./tabs/TabUsers";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const handleLogin = () => {
		setIsLoggedIn(true);
	};

	const [isCatalogueLoggedIn, setIsCatalogueLoggedIn] = useState(false);

	const handleCatalogueLogin = () => {
		setIsCatalogueLoggedIn(true);
	};
	const fetchProducts = useCatalogueStore((state) => state.fetchProducts);

	useEffect(() => {
		fetchProducts();
	});

	const fetchServices = useCatalogueStore((state) => state.fetchServices);

	useEffect(() => {
		fetchServices();
	});

	const fetchReceipts = useReceiptsStore((state) => state.fetchReceipts);
	useEffect(() => {
		fetchReceipts();
	});

	const fetchReceiptRows = useReceiptsStore((state) => state.fetchReceiptRows);
	useEffect(() => {
		fetchReceiptRows();
	});

	const [openProductModal, setOpenProductModal] = useState(false);
	const [openSettingsModal, setOpenSettingsModal] = useState(false);
	const [openReceiptsModal, setOpenReceiptsModal] = useState(false);
	const [openCortesModal, setOpenCortesModal] = useState(false);
	const [showNoCorteModal, setShowNoCorteModal] = useState(false);

	const [name, setName] = useState("");

	const { productsOnOrder, processOrder } = useOrderStore();

	const handleSubmitProductModal = async (event) => {
		event.preventDefault();

		const fetchLastOpenCorte = useCortesStore.getState().fetchLastOpenCorte;

		try {
			const lastOpenCorte = await fetchLastOpenCorte();

			if (lastOpenCorte) {
				if (productsOnOrder.length > 0) {
					setShowPayment(true);
				}
				if (deformatPrecio(pago) >= total && productsOnOrder.length > 0) {
					processOrder(deformatPrecio(pago), deformatPrecio(cambio));
					setCambio(formatPrecio(0));
					setPago(formatPrecio(0));
					setShowPayment(false);
					setOpenProductModal(false);
				}
			} else {
				setShowNoCorteModal(true);
				console.log("No se puede procesar la orden. No hay un corte abierto.");
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubmitSettingsModal = (event) => {
		event.preventDefault();
		setOpenSettingsModal(false);
	};

	const handleSubmitReceiptsModal = (event) => {
		event.preventDefault();
		setOpenReceiptsModal(false);
	};

	const handleSubmitCortesModal = (event) => {
		event.preventDefault();
		fetchLastOpenCorte();
		setOpenCortesModal(false);
	};

	const handleCloseProductModal = () => {
		setName("");
		setOpenProductModal(false);
	};

	const [showPayment, setShowPayment] = useState(false);

	const { total } = useOrderStore((state) => ({
		total: state.total,
	}));
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
	const [pago, setPago] = useState(formatPrecio(0));
	const [cambio, setCambio] = useState(formatPrecio(0));

	const handlePagoChange = (event) => {
		const inputValue = event.target.value;
		const numericValue = inputValue.replace(/[^0-9]/g, "");

		const pagoValue = parseInt(numericValue);
		const totalValue = total * 100;
		const cambioValue = pagoValue - totalValue;

		setCambio(formatPrecio(cambioValue));
		setPago(formatPrecio(pagoValue));
	};

	const fetchLastOpenCorte = useCortesStore(
		(state) => state.fetchLastOpenCorte
	);

	return (
		<>
			{isLoggedIn ? (
				<>
					<Header aria-label="Trampolin Tracker">
						<SkipToContent />
						<HeaderName href="#" prefix="">
							Funny Jumping
						</HeaderName>
						<HeaderGlobalBar>
							<HeaderGlobalAction
								aria-label="Recibos"
								onClick={() => setOpenReceiptsModal(true)}
							>
								<Receipt size={20} />
							</HeaderGlobalAction>
							<HeaderGlobalAction
								aria-label="Cortes"
								onClick={() => setOpenCortesModal(true)}
							>
								<Money size={20} />
							</HeaderGlobalAction>
							<HeaderGlobalAction
								aria-label="Ajustes"
								onClick={() => setOpenSettingsModal(true)}
							>
								<Settings size={20} />
							</HeaderGlobalAction>
						</HeaderGlobalBar>
					</Header>

					<TablaTemporizador setOpenProductModal={setOpenProductModal}/> 

					<Modal
						open={openProductModal}
						onRequestClose={handleCloseProductModal}
						modalHeading="Realizar Venta"
						modalLabel="Nueva Venta"
						primaryButtonText="Aceptar"
						secondaryButtonText="Cancelar"
						onRequestSubmit={handleSubmitProductModal}
						preventCloseOnClickOutside={true}
						size="lg"
						isFullWidth={true}
						aria-label="Realizar Nueva Venta"
						hasScrollingContent={true}
					>
						<div id="modalVenta">
							{showPayment ? (
								<div style={{ marginTop: "20px", marginBottom: "30px" }}>
									<Grid>
										<Column sm={2} md={2} lg={4}>
											<Button
												onClick={() => setShowPayment(false)}
												renderIcon={ArrowLeft}
											>
												Regresar
											</Button>
											<Column>
												<div style={{ marginRight: "200px" }}></div>
											</Column>
										</Column>

										<Column sm={2} md={3} lg={6}>
											<h4 style={{ paddingTop: "15px" }}>Pago</h4>
											<TextInput
												labelText=""
												size="xl"
												value={pago}
												onChange={handlePagoChange}
											></TextInput>
											<h4 style={{ paddingTop: "15px" }}>Monto</h4>
											<TextInput
												labelText=""
												size="lg"
												readOnly
												value={formatPrecio(total * 100)}
											></TextInput>

											<h4 style={{ paddingTop: "25px" }}>Cambio</h4>

											<TextInput
												labelText=""
												size="lg"
												value={cambio}
												readOnly
											></TextInput>
										</Column>
									</Grid>
								</div>
							) : (
								<>
									<div id="ventaSlider">
										<FormularioOrden name={name} setName={setName} />
										<TablaProductos></TablaProductos>
									</div>
									<div id="ventaTicket" className="background-white">
										<TablaOrden></TablaOrden>
									</div>
								</>
							)}
						</div>
					</Modal>
					<Modal
						open={showNoCorteModal}
						onRequestClose={() => setShowNoCorteModal(false)}
						passiveModal
						modalHeading="No hay un corte abierto"
					/>

					<Modal
						open={openSettingsModal}
						onRequestClose={() => (
							setOpenSettingsModal(false), setIsCatalogueLoggedIn(false)
						)}
						passiveModal
						onRequestSubmit={handleSubmitSettingsModal}
						size="lg"
						isFullWidth={true}
						aria-label="Ajustes"
						hasScrollingContent={false}
						zIndex={9999}
					>
						{isCatalogueLoggedIn ? (
							<>
								<Tabs>
									<TabList activation="manual" aria-label="List of tabs">
										<Tab renderIcon={Product}>Productos</Tab>
										<Tab renderIcon={Time}>Trampolín</Tab>
										<Tab renderIcon={User}>Usuarios</Tab>
									</TabList>
									<TabPanels>
										<TabPanel key="tabProductos">
											<TabProductos />
										</TabPanel>
										<TabPanel key="tabTrampolin">
											<TabTrampolin />
										</TabPanel>
										<TabPanel key="tabLogin">
											<TabUsers />
										</TabPanel>
									</TabPanels>
								</Tabs>
							</>
						) : (
							<CatalogueLogin onLogin={handleCatalogueLogin} />
						)}
					</Modal>
					<Modal
						open={openReceiptsModal}
						onRequestClose={() => setOpenReceiptsModal(false)}
						modalHeading="Recibos"
						modalLabel="Historial de Recibos"
						passiveModal
						onRequestSubmit={handleSubmitReceiptsModal}
						size="lg"
						isFullWidth={true}
						aria-label="Recibos"
						hasScrollingContent={false}
					>
						<TablaRecibos></TablaRecibos>
					</Modal>

					<Modal
						open={openCortesModal}
						onClick={fetchLastOpenCorte}
						onRequestClose={() => (
							fetchLastOpenCorte(), setOpenCortesModal(false)
						)}
						modalLabel="Historial de Cortes"
						passiveModal
						onRequestSubmit={handleSubmitCortesModal}
						size="lg"
						isFullWidth={true}
						aria-label="Cortes"
						hasScrollingContent={false}
					>
						<TablaCortes></TablaCortes>
					</Modal>
				</>
			) : (
				<Login onLogin={handleLogin} />
			)}
		</>
	);
}

export default App;
