import React, { useState, useEffect } from "react";
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
import { Grid, Column } from "@carbon/react";
import { Add, ArrowLeft } from "@carbon/react/icons";
import { useUserStore } from "../store/appStore";

const TabUsers = () => {
	const {
		searchTerm,
		setSearchTerm,
		users,
		fetchUsers,
		createUser,
		editUser,
		deleteUser,
	} = useUserStore();

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const filteredUsers = users.filter((user) =>
		user.username.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleUserSearch = (term) => {
		setSearchTerm(term);
	};

	const handleCreateUser = () => {
		createUser(username, password);
		setUsername("");
		setPassword("");
		setOpenAddUser(false);
	};

	const handleEditUser = () => {
		editUser(editingUserId, username, password);
		setEditingUserId("");
		setUsername("");
		setPassword("");
		setOpenAddUser(false);
	};

	const handleDeleteUser = (userId) => {
		deleteUser(userId);
	};

	const [openAddUser, setOpenAddUser] = useState(false);
	const [editingUserId, setEditingUserId] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleOpenEditUser = (user) => {
		console.log(user.cells[1].value)
		setEditingUserId(user.id);
		setUsername(user.cells[1].value); // Set username state
		setPassword(""); // Clear password state
		setOpenAddUser(true);
	};

	const handleGoBack = () => {
		setEditingUserId("");
		setUsername("");
		setPassword("");
		setOpenAddUser(false);
	};

	const headers = [
		{
			key: "id",
			header: "ID",
		},
		{
			key: "username",
			header: "Username",
		},
	];
	return (
		<>
			{openAddUser ? (
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
							onClick={handleGoBack}
							style={{ marginRight: "15px" }}
						>
							<ArrowLeft></ArrowLeft>
						</IconButton>
						{editingUserId ? (
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									width: "100%",
									marginRight: "150px",
								}}
							>
								<h1> Editar Usuario</h1>
								<h1> ID: {editingUserId}</h1>
							</div>
						) : (
							<h1> Agregar Usuario </h1>
						)}
					</div>

					<FormGroup legendText="">
						<TextInput
							style={{ marginBottom: "5px" }}
							id="username-input"
							type="text"
							required
							labelText="Usuario"
							value={username} // Bind value to username state
							onChange={handleUsernameChange} // Handle changes to username
						/>

						<TextInput.PasswordInput
							style={{ marginBottom: "5px" }}
							id="password-input"
							labelText="Contraseña"
							required={!editingUserId}
							value={password}
							onChange={handlePasswordChange}
						/>

						{editingUserId ? (
							<Button
								style={{ marginBottom: "5px" }}
								type="submit"
								id="buttonEditarUsuario"
								renderIcon={Add}
								onClick={handleEditUser}
								kind="tertiary"
							>
								Editar
							</Button>
						) : (
							<Button
								style={{ marginBottom: "5px" }}
								type="submit"
								id="buttonAgregarUsuario"
								renderIcon={Add}
								onClick={handleCreateUser}
								kind="tertiary"
							>
								Agregar
							</Button>
						)}
					</FormGroup>
				</>
			) : (
				<DataTable
					stickyHeader
					headers={headers}
					rows={filteredUsers}
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
										onChange={(event) => handleUserSearch(event.target.value)}
										persistent
									/>
									<Button onClick={() => setOpenAddUser(true)} renderIcon={Add}>
										Agregar
									</Button>
								</TableToolbarContent>
							</TableToolbar>

							<Table {...getTableProps()} aria-label="user table">
								<TableHead>
									<TableRow>
										{headers.map((header) => (
											<TableHeader
												key={header.key}
												{...getHeaderProps({ header })}
											>
												{header.header}
											</TableHeader>
										))}
										<TableHeader aria-label="overflow actions" />
									</TableRow>
								</TableHead>
								<TableBody>
									{rows.map((row) => (
										<TableRow key={row.id} {...getRowProps({ row })}>
											{row.cells.map((cell) => (
												<TableCell key={cell.id}>{cell.value}</TableCell>
											))}

											<TableCell className="cds--table-column-menu">
												<div style={{ zIndex: 10000 }}>
													<OverflowMenu size="md" flipped>
														<OverflowMenuItem
															itemText="Editar"
															onClick={() => handleOpenEditUser(row)}
														/>
														<OverflowMenuItem
															isDelete
															itemText="Eliminar"
															onClick={() => handleDeleteUser(row.id)}
														/>
													</OverflowMenu>
												</div>
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

export default TabUsers;
