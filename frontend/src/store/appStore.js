import { create } from "zustand";

//import mp3File from "../mp3/notificacion.mp3";

import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";
const API_PRINTING_URL = "http://localhost:8080/api";

export const useUserStore = create((set) => ({
	activeUser: null,
	users: [],
	searchTerm: "",
	setSearchTerm: (term) => set({ searchTerm: term }),

	createUser: async (username, password) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/users/`, {
				username,
				password,
			});

			set((state) => ({
				users: [...state.users, response.data],
			}));
		} catch (error) {
			console.error(error);
		}
	},

	fetchUsers: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/users`);
			set({ users: response.data });
		} catch (error) {
			console.error(error);
		}
	},

	editUser: async (id, username, password) => {
		try {
			const response = await axios.put(`${API_BASE_URL}/users/${id}`, {
				username,
				password,
			});

			set((state) => ({
				users: state.users.map((user) =>
					user.id === id ? response.data : user
				),
			}));
		} catch (error) {
			console.error(error);
		}
	},

	deleteUser: async (id) => {
		try {
			await axios.delete(`${API_BASE_URL}/users/${id}`);

			set((state) => ({
				users: state.users.filter((user) => user.id !== id),
			}));
		} catch (error) {
			console.error(error);
		}
	},

	validateUser: async (username, password) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/users/validate`, {
				username,
				password,
			});

			console.log(response.data);
			
			return response.data;
		} catch (error) {
			console.error(error);
			return { error: "Invalid username or password" };
		}
	},
}));

export const useCatalogueStore = create((set) => ({
	productsRows: [],
	services: [],
	searchTerm: "",
	setSearchTerm: (term) => set({ searchTerm: term }),

	createProduct: async (producto, descripcion, precio, tipo) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/products/`, {
				producto,
				descripcion,
				precio,
				tipo,
			});

			set((state) => ({
				productsRows: [...state.productsRows, response.data],
			}));
		} catch (error) {
			console.error(error);
		}
	},

	fetchProducts: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/products`);
			set({ productsRows: response.data });
		} catch (error) {
			console.error(error);
		}
	},

	editProduct: async (id, producto, descripcion, precio, tipo) => {
		try {
			const response = await axios.put(`${API_BASE_URL}/products/${id}`, {
				producto,
				descripcion,
				precio,
				tipo,
			});

			set((state) => ({
				productsRows: state.productsRows.map((product) =>
					product.id === id ? response.data : product
				),
			}));
		} catch (error) {
			console.error(error);
		}
	},

	deleteProduct: async (id) => {
		try {
			await axios.delete(`${API_BASE_URL}/products/${id}`);

			set((state) => ({
				productsRows: state.productsRows.filter((product) => product.id !== id),
			}));
		} catch (error) {
			console.error(error);
		}
	},
	createService: async (tiempo, precio) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/services`, {
				nombre: "Renta Trampolín",
				tiempo,
				precio,
				text: `$${precio} - ${tiempo} minuto(s)`,
				tipo: "Servicio",
			});
			set((state) => ({
				services: [...state.services, response.data],
			}));
		} catch (error) {
			console.error(error);
		}
	},

	fetchServices: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/services`);
			set({ services: response.data });
		} catch (error) {
			console.error(error);
		}
	},

	editService: async (id, tiempo, precio) => {
		try {
			const response = await axios.put(`${API_BASE_URL}/services/${id}`, {
				tiempo,
				precio,
				text: `$${precio} - ${tiempo} minuto(s)`,
			});
			set((state) => ({
				services: state.services.map((service) =>
					service.id === id ? response.data : service
				),
			}));
		} catch (error) {
			console.error(error);
		}
	},

	deleteService: async (id) => {
		try {
			await axios.delete(`${API_BASE_URL}/services/${id}`);
			set((state) => ({
				services: state.services.filter((service) => service.id !== id),
			}));
		} catch (error) {
			console.error(error);
		}
	},
}));

export const useOrderStore = create((set, get) => ({
	productsOnOrder: [],

	total: 0,

	addProductOnOrder: (rowData) => {
		console.log("Adding row:", rowData);
		set((state) => {
			const productIndex = state.productsOnOrder.findIndex(
				(product) => product.id === rowData.id
			);
			let totalPrice = state.total; // Inicializamos el totalPrice con el valor actual
			if (productIndex !== -1) {
				// Si el producto ya existe, actualiza su cantidad, recalcula el subtotal y el total
				const updatedProductsOnOrder = [...state.productsOnOrder];
				updatedProductsOnOrder[productIndex] = {
					...updatedProductsOnOrder[productIndex],
					cantidad: updatedProductsOnOrder[productIndex].cantidad + 1,
					subtotal:
						(updatedProductsOnOrder[productIndex].cantidad + 1) *
						updatedProductsOnOrder[productIndex].precio,
				};
				// Calculamos el nuevo totalPrice sumando el precio del producto añadido
				totalPrice += rowData.precio;
				return {
					...state,
					productsOnOrder: updatedProductsOnOrder,
					total: totalPrice,
				};
			} else {
				const updatedProductsOnOrder = [
					...state.productsOnOrder,
					{
						...rowData,
						cantidad: 1,
						subtotal: rowData.precio,
					}, // Multiplicamos la cantidad por el precio para calcular el subtotal
				];
				// Calculamos el nuevo totalPrice sumando el precio del producto añadido
				totalPrice += rowData.precio;
				return {
					...state,
					productsOnOrder: updatedProductsOnOrder,
					total: totalPrice,
				};
			}
		});
	},
	addServiceOnOrder: (rowData) => {
		console.log("Adding service row:", rowData);
		set((state) => {
			rowData.subtotal = rowData.precio;
			let totalPrice = state.total;
			totalPrice += rowData.precio;
			// Update the products on order array by adding the new service
			const updatedProductsOnOrder = [...state.productsOnOrder, rowData];
			// Return the updated state with the new total and products on order
			return {
				...state,
				productsOnOrder: updatedProductsOnOrder,
				total: totalPrice,
			};
		});
	},
	removeProductOnOrder: (rowData) => {
		set((state) => {
		  const updatedProductsOnOrder = state.productsOnOrder.map((product) => {
			if (product.id === rowData.id && product.cantidad > 0) {
			  const updatedCantidad = product.cantidad - 1;
			  const updatedSubtotal = updatedCantidad * product.precio; // Recalcular el subtotal
			  return {
				...product,
				cantidad: updatedCantidad,
				subtotal: updatedSubtotal, // Actualizar el subtotal
			  };
			}
			return product;
		  });
	  
		  const filteredProductsOnOrder = updatedProductsOnOrder.filter(
			(product) => product.cantidad > 0
		  );
	  
		  // Calculate the price of the removed product
		  const removedProduct = state.productsOnOrder.find(
			(product) => product.id === rowData.id
		  );
		  const removedProductPrice = removedProduct ? removedProduct.precio : 0;
	  
		  // Subtract the price of the removed product from the total
		  const totalPrice = state.total - removedProductPrice;
	  
		  return {
			...state,
			productsOnOrder: filteredProductsOnOrder,
			total: totalPrice,
		  };
		});
	  },
	processOrder: async (pago, cambio) => {
		const productsOnOrder = get().productsOnOrder;
		const addReceipt = useReceiptsStore.getState().addReceipt;
		const total = get().total;
		const fetchLastOpenCorte = useCortesStore.getState().fetchLastOpenCorte;
		try {
			const lastOpenCorte = await fetchLastOpenCorte();
			console.log("last open corte", lastOpenCorte);
			if (lastOpenCorte) {
				const objetoReceipt = {
					fecha: new Date(),
					total: total,
					pago: pago,
					cambio: cambio,
					productos: productsOnOrder,
				};
				addReceipt(objetoReceipt);
				set({ productsOnOrder: [] });
				set({ total: 0 });
			} else {
				console.log("No se puede procesar la orden. No hay un corte abierto.");
			}
		} catch (error) {
			console.error(error);
		}
	},
}));

export const useTemporizadorStore = create((set, get) => ({
	temporizadorRows: [],
	searchTerm: "",
	setSearchTerm: (term) => set({ searchTerm: term }),
	addTemporizadorRow: (rowData) => {
		set((state) => ({
			temporizadorRows: [...state.temporizadorRows, rowData],
		}));
	},
	updateTiempoRestante: () => {
		const now = new Date();
		const updatedRows = get()
			.temporizadorRows.map((row) => {
				let tiempoRestante = row.tiempoRestante;
				let horaInicio = new Date(row.fecha);

				if (!row.detenido) {
					tiempoRestante =
						row.tiempoRentado * 60 -
						(now.getTime() - horaInicio.getTime()) / 1000;
				}

				return { ...row, tiempoRestante };
			})
			.filter(Boolean);

		set({ temporizadorRows: updatedRows });
	},
	stopTemporizadorRow: async (rowId, tiempoUsado) => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/detenerReceiptRow/${rowId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ tiempoUsado }),
				}
			);

			if (response.ok) {
				set((state) => ({
					temporizadorRows: state.temporizadorRows.map((row) =>
						row.id === rowId ? { ...row, detenido: true, tiempoUsado } : row
					),
				}));
			} else {
				console.error("Failed to stop temporizador row");
			}
		} catch (error) {
			console.error("Error stopping temporizador row:", error);
		}
	},
}));

export const useReceiptsStore = create((set) => ({
	receiptsRows: [],

	addReceipt: async (receiptData) => {
		if (!receiptData.productos || receiptData.productos.length === 0) {
			console.log("Error: Cannot add receipt with empty products list.");
			return;
		}
		console.log("Adding receipt:", receiptData);
		try {
			const responseReceipt = await axios.post(`${API_BASE_URL}/receipts`, {
				...receiptData,
				productos: receiptData.productos.map((producto) => ({
					nombre: producto.producto,
					descripcion: producto.descripcion,
					precio: producto.precio,
					cantidad: producto.cantidad,
					subtotal: producto.subtotal,
					tipo: producto.tipo,
					tiempoRentado:
						producto.tipo === "Servicio"
							? parseFloat(producto.tiempoRentado)
							: 0,
				})),
			});

			// Fetch the updated list of receipts after creating a new one
			const response = await axios.get(`${API_BASE_URL}/receipts`);

			set({ receiptsRows: response.data });

			useReceiptsStore.getState().fetchReceiptRows();

			useReceiptsStore.getState().printReceipt(responseReceipt.data.id);
		} catch (error) {
			console.error(error);
		}
	},
	fetchReceipts: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/receipts`);

			set({ receiptsRows: response.data });
		} catch (error) {
			console.error(error);
		}
	},
	fetchReceiptRows: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/receiptRows`);
			const receiptRows = response.data;

			// Import the useTemporizadorStore
			const temporizadorStore = useTemporizadorStore.getState();

			// Clear the existing temporizadorRows
			temporizadorStore.temporizadorRows = [];

			// Add each receiptRow to the temporizadorRows list using the addTemporizadorRow function from useTemporizadorStore
			receiptRows.forEach((rowData) => {
				rowData.tiempoRestante = rowData.tiempoRentado * 60;
				temporizadorStore.addTemporizadorRow(rowData);

			});

			set({ receiptRows: receiptRows });
		} catch (error) {
			console.error(error);
		}
	},
	printReceipt: async (idReceipt) => {
		const getDate = (dateString) => {
			const datetime = new Date(dateString);
			const monthName = datetime.toLocaleString("es", { month: "long" });
			const year = datetime.getFullYear();
			const day = datetime.getDate();

			return `${day} de ${monthName} del ${year}`;
		};

		const getHour = (dateString) => {
			const datetime = new Date(dateString);

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

			return `${hour}:${minute} ${period}`;
		};

		try {
			const receiptRows = useReceiptsStore.getState().receiptsRows;
			const receiptToPrint = receiptRows.find(
				(receipt) => receipt.id === idReceipt
			);
			if (!receiptToPrint) {
				console.log(`Receipt with ID ${idReceipt} not found.`);
				return;
			}

			const fechaToFormat = receiptToPrint.fecha;

			const fecha = getDate(fechaToFormat);
			const hora = getHour(fechaToFormat);

			// Extract the necessary data from the receiptToPrint object
			const { id, total, pago, cambio, productos } = receiptToPrint;

			// Send the receipt data to the printer API
			const response = await axios.post(`${API_PRINTING_URL}/ticket`, {
				id,
				hora,
				fecha,
				total,
				pago,
				cambio,
				productos,
			});

			console.log("Printing response:", response.data);
		} catch (error) {
			console.error(error);
		}
	},
}));

export const useCortesStore = create((set) => ({
	cortesRows: [],
	openCorte: async (corteData) => {
		if (!corteData.fondoInicio) {
			console.log("Error: Cannot add corte without fondoInicio.");
			return;
		}
		console.log("Adding corte:", corteData);
		try {
			await axios.post(`${API_BASE_URL}/cortes/abrir`, corteData);
			// Fetch the updated list of cortes after creating a new one
			const response = await axios.get(`${API_BASE_URL}/cortes`);
			set({ cortesRows: response.data });
		} catch (error) {
			console.error(error);
		}
	},
	fetchCortes: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/cortes`);
			set({ cortesRows: response.data });
		} catch (error) {
			console.error(error);
		}
	},
	closeCorte: async (corteData) => {
		if (
			!corteData.recibos ||
			!corteData.fondoFinal ||
			!corteData.folioInicial ||
			!corteData.folioFinal ||
			!corteData.efectivoTotal ||
			!corteData.recibosTotal
		) {
			console.log(
				"Error: Cannot close corte without recibos, fondoFinal, folioInicial, and folioFinal."
			);
			return;
		}
		console.log("Closing corte:", corteData);
		try {
			const ultimoCorte = await axios.put(
				`${API_BASE_URL}/cortes/cerrar`,
				corteData
			);

			const response = await axios.get(`${API_BASE_URL}/cortes`);
			set({ cortesRows: response.data });

			const printCorte = useCortesStore.getState().printCorte;

			printCorte(ultimoCorte.data.id);
		} catch (error) {
			console.error(error);
		}
	},
	fetchLastOpenCorte: async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/cortes/ultimo`);
			return response.data;
		} catch (error) {
			console.error(error);
			return null;
		}
	},
	fetchReceiptsByDate: async (startDate) => {
		try {
			const currentDate = new Date();

			const formattedStartDate = startDate;
			const formattedCurrentDate = currentDate;

			const response = await axios.get(`${API_BASE_URL}/receiptsDateRange`, {
				params: {
					startDate: formattedStartDate,
					endDate: formattedCurrentDate,
				},
			});

			return response.data;
		} catch (error) {
			console.error(error);
			return [];
		}
	},
	printCorte: async (idCorte) => {
		const formatSimpleTime = (dateString) => {
			if (dateString !== null) {
				const datetime = new Date(dateString);

				const monthIndex = datetime.getMonth() + 1;
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

				return ` ${hour}:${minute} ${period} ${day}/${monthIndex}/${year}`;
			} else {
				return " ";
			}
		};

		const agruparPorNombre = (lista) => {
			console.log(lista);

			const agrupado = {};

			for (const elem of lista) {
				const { nombre, cantidad, subtotal } = elem;

				if (!agrupado[nombre]) {
					agrupado[nombre] = { nombre, cantidad: 0, subtotal: 0 };
				}

				agrupado[nombre].cantidad += cantidad;
				agrupado[nombre].subtotal += subtotal;
			}

			console.log(agrupado);
			return Object.values(agrupado);
		};

		try {
			const cortesRows = useCortesStore.getState().cortesRows;
			const corteToPrint = cortesRows.find((corte) => corte.id === idCorte);

			if (!corteToPrint) {
				console.log(`Corte with ID ${idCorte} not found.`);
				return;
			}

			const fechaInicialToFormat = corteToPrint.fechaInicio;
			const fechaInicial = formatSimpleTime(fechaInicialToFormat);

			const fechaFinalToFormat = corteToPrint.fechaFinal;
			const fechaFinal = formatSimpleTime(fechaFinalToFormat);

			const {
				id,
				fondoInicio,
				fondoFinal,
				folioInicial,
				folioFinal,
				efectivoTotal,
				recibosTotal,
			} = corteToPrint;

			const response = await axios.get(`${API_BASE_URL}/receiptsByCorte`, {
				params: {
					corteId: id,
				},
			});

			const corteReceipts = response.data;
			console.log(corteReceipts);

			// Obtener los productos de los recibos del corte actual
			const productos = corteReceipts.flatMap((receipt) => receipt.productos);

			// Agrupar los productos por nombre y sumar cantidades y subtotales
			const productosAgrupados = agruparPorNombre(productos);

			// Enviar los datos del corte y los productos a la API de impresión
			const printResponse = await axios.post(
				`${API_PRINTING_URL}/ticketcorte`,
				{
					id,
					fondoInicio,
					fondoFinal,
					folioInicial,
					folioFinal,
					fechaFinal,
					fechaInicial,
					efectivoTotal,
					recibosTotal,
					productos: productosAgrupados,
				}
			);

			console.log("Printing response:", printResponse.data);
		} catch (error) {
			console.error(error);
		}
	},
}));
