import { Stack, FormGroup, TextInput, Dropdown, Button } from "@carbon/react";

import { v4 as uuidv4 } from "uuid";

import { Add } from "@carbon/react/icons";
import { useState } from "react";
import { useCatalogueStore, useOrderStore } from "../store/appStore";

import PropTypes from "prop-types";

const FormularioOrden = ({ name, setName }) => {
	const minutes = useCatalogueStore((state) => state.services);

	const { addServiceOnOrder } = useOrderStore(
		
	);

	const handleAgregarNuevo = () => {
		if (name && name.trim() !== "" && tiempo !== "" && precio !== "") {
			const objetoPrueba = {
				id: uuidv4(),
				producto: `Brincolín ${tiempo} minutos `,
				descripcion: name,
				nombre: name,
				horaInicio: 0,
				tiempoRentado: tiempo,
				tiempoRentadoSegundos: tiempo * 60,
				tiempoRestante: 0,
				precio: precio,
				cantidad: 1,
				tipo: "Servicio",
			};
			addServiceOnOrder(objetoPrueba);
			setName("");
		}
	};

	const [tiempo, setTiempo] = useState("");
	const [precio, setPrecio] = useState()

	
	const handleNameChange = (event) => {
		const inputValue = event.target.value;
		const formattedValue = inputValue.replace(/(^|\s)\w/g, (char) =>
			char.toUpperCase()
		);
		setName(formattedValue);
	};

	const handleTiempoChange = (event) => {
		setPrecio(event.selectedItem.precio);
		setTiempo(event.selectedItem.tiempo);
	};

	return (
		<Stack gap={7}>
			<FormGroup legendText="">
				<TextInput
					autoComplete="off"
					id="nombre-input"
					type="text"
					required
					labelText="Nombre"
					value={name}
					onChange={handleNameChange}
				/>
				<Dropdown
					id="minutos-dropdown"
					titleText="Tiempo"
					label="Tiempo Seleccionado"
					items={minutes}
					itemToString={(item) => (item ? item.text : "")}
					onChange={handleTiempoChange}
				/>

				<Button
					type="submit"
					id="buttonVentaAgregar"
					renderIcon={Add}
					onClick={handleAgregarNuevo}
					kind="tertiary"
				>
					Añadir
				</Button>
			</FormGroup>
		</Stack>
	);
};

FormularioOrden.propTypes = {
	name: PropTypes.string.isRequired,
	setName: PropTypes.func.isRequired,
};

export default FormularioOrden;
