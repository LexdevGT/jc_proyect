<?php
//error_log('Reconoce PHP');
	session_start();
	date_default_timezone_set('America/Guatemala');
	
	require_once('connect.php');

	if(isset($_POST['option'])){
		$option = $_POST['option'];
	
		switch ($option) {
			case 'connect':
				connectFunction();
				break;
			case 'sign_in':
				signInFunction();
				break;
			case 'load_roles':
				loadRoleFunction();
				break;
			case 'load_phones':
				loadPhonesFunction();
				break;
			case 'load_users':
				loadUsersFunction();
				break;
			case 'load_companies':
				loadCompaniesFunction();
				break;
			case 'load_transport_type':
				loadTransportTypeFunction();
				break;
			case 'load_zip_codes':
				loadZipCodesFunction();
				break;
			case 'load_global_search':
				loadGlobalSearchFunction();
				break;
			case 'update_role_status':
				updateRoleStatusFunction();
				break;
			case 'save_role':
				saveRoleFunction();
				break;
			case 'save_user':
				saveUserFunction();
				break;
			case 'save_new_order':
				saveNewOrderFunction();
				break;
			case 'save_companies_software':
				saveCompaniesSoftwareFunction();
				break;
			case 'update_user':
				updateUserFunction();
				break;	
			case 'update_user_status':
				updateUserStatusFunction();
				break;
			case 'update_status':
				updateStatusFunction();
				break;
			case 'get_user_info':
				getUserInfoFunction();
				break;
			case 'get_customer_info':
				getCustomerInfoFunction();
				break;
			case 'get_zip_info':
				getZipInfoFunction();
				break;
			case 'get_companies_info':
				getCompaniesInfoFunction();
				break;
		}
	}

	function nueva(){
		global $conn;
		$jsondata = array();
		$error 	  = '';
		$message  = '';

		$query = "SELECT id_rol,nombre_rol FROM roles 
				  WHERE status_rol = 1;
				 ";
		$execute_query = $conn->query($query);

		if($execute_query){

		}else{
			$error = 'Error cargando los roles de base de datos: '.$conn->error;
		}

		$jsondata['message'] = $message;
		$jsondata['error']   = $error;
		echo json_encode($jsondata);
	}

	function saveCompaniesSoftwareFunction(){
	    global $conn;
	    $jsondata   	= array();
	    $error      	= '';
	    $message		= '';
	    $company_name 	= $_POST['companyTxt'];
	    $company_id    	= isset($_POST['companyId']) ? $_POST['companyId'] : '';

	    // Si el ID de la compañia está presente, hacemos un UPDATE
	    if($company_id != ''){
	        $query = "UPDATE companies_software SET company_name='$company_name' WHERE id='$company_id'";
	        $execute_query = $conn->query($query);

	        if($execute_query){
	            $message = 'Company updated successfully!';
	        }else{
	            $error = 'ERROR updating company: '.$conn->error;
	        }
	    } 
	    // Si no hay ID, hacemos un INSERT
	    else {
	        $query = "INSERT INTO companies_software(company_name,date_created,status) VALUES ('$company_name',NOW(),1)";
	        $execute_query = $conn->query($query);

	        if($execute_query){
	            $message = 'Company saved correctly!';
	        }else{
	            $error = 'ERROR inserting Company: '.$conn->error;
	        }
	    }

	    $jsondata['message'] = $message;
	    $jsondata['error']   = $error;
	    echo json_encode($jsondata);
	}

	function getCompaniesInfoFunction(){
		global $conn;
		$jsondata = array();
		$error = '';
		$data = array();

		$Id = $_POST['id'];

		$query = "SELECT company_name as name 
					FROM companies_software 
					WHERE id = $Id
					";
		$result = $conn->query($query);

		if ($result) {
			$data = $result->fetch_assoc();
		} else {
			$error = 'Error fetching data: '.$conn->error;
		}

		$jsondata['data'] = $data;
		$jsondata['error'] = $error;
		echo json_encode($jsondata);
	}

	function updateStatusFunction(){
		global $conn;
		$id 	= $_POST['id'];
		$status = $_POST['status'];
		$table 	= $_POST['table'];

		$query = "UPDATE $table SET status = ? WHERE id = ?";
		$stmt = $conn->prepare($query);
		$stmt->bind_param("ii", $status, $id);

		if($stmt->execute()){
			$jsondata['error'] = '';
			$jsondata['message'] = 'Status changed successfully!';
		} else {
			$jsondata['error'] = 'ERROR: ' . $conn->error;
		}

		echo json_encode($jsondata);
	}

	function loadCompaniesFunction() {
		global $conn;
		$jsondata = array();
		$error 	= '';
		$data 	= array();
		$roles 	= array();
		//ESTE QUERY DEBE DE CAMBIAR CUANDO LA EMPRESA MADRE EXISTA, AGREGAR UN WHERE
		$query = "SELECT
					id,
					company_name,
					DATE_FORMAT(date_created , '%d-%m-%Y') as date_created,
					status
				FROM companies_software cs ";
		//error_log($query);
		$result = $conn->query($query);

		if ($result) {
			while ($row = $result->fetch_assoc()) {
			  $data[] = $row;
			}
		} else {
			$error = 'Error fetching data: '.$conn->error;
		}
//error_log(print_r($data,true));
		$jsondata['data'] 	= $data;
		$jsondata['error'] 	= $error;
		echo json_encode($jsondata);
	}

	function loadGlobalSearchFunction(){
		global $conn;
		$jsondata = array();
		$error = '';
		$data = array();
		// Consulta SQL para obtener los datos de la tabla 'orders'
		$sql = "SELECT id, 
				   'Order' AS type, 
				   DATE_FORMAT(shipment_first_avalilable_pickup_date, '%m/%d/%Y') AS date_created, 
				   orders.status, 
				   CONCAT(customers.name, ' ', customers.last_name)  AS customer_name, 
				   origin_contact_phone_1 AS phone, 
				   customers.email  AS customer_email, 
				   '' AS customer_vehicles 
				FROM orders
				INNER JOIN customers
				ON customers.id_customer = orders.id_customer ";

		$result = $conn->query($sql);

		$orders = array();

		if ($result->num_rows > 0) {
		  // Convertir cada fila en un array
		  while($row = $result->fetch_array()) {
		    $data[] = array(
					'id' 				=> $row['id'],
					'type' 				=> $row['type'],
					'date_created' 		=> $row['date_created'],
					'status'			=> $row['status'],
					'customer_name'		=> $row['customer_name'],
					'phone'				=> $row['phone'],
					'customer_email'	=> $row['customer_email'],
					'customer_vehicles'	=> $row['customer_vehicles']
				);
		  }
		}else{
			$error = 'Error: '.$conn->error;
		}
//error_log(print_r($data,true));
		$jsondata['data']		= $data;
		$jsondata['error']   	= $error;
		echo json_encode($jsondata);
	}

	function saveNewOrderFunction(){
	    global $conn;
	    $jsondata   = array();
	    $error      = '';
	    $message    = '';

	    $customerId = isset($_POST['phone']) ? $_POST['phone'] : '';
	    $firstAvailablePickupDate = isset($_POST['first_available_pickup_date']) ? date('Y-m-d', strtotime($_POST['first_available_pickup_date'])) : '';
	    $transportType = isset($_POST['transport_type']) ? $_POST['transport_type'] : '';
	    $assignedUserId = isset($_POST['assigned_user']) ? $_POST['assigned_user'] : '';

	    $origin_saved_contact = isset($_POST['origin_saved_contact']) ? $_POST['origin_saved_contact'] : '';
		$origin_auction_site = isset($_POST['origin_auction_site']) ? $_POST['origin_auction_site'] : '';
		$origin_terminal = isset($_POST['origin_terminal']) ? $_POST['origin_terminal'] : '';
		$origin_type = isset($_POST['origin_type']) ? $_POST['origin_type'] : '';
		$origin_address = isset($_POST['origin_address']) ? $_POST['origin_address'] : '';
		$origin_address2 = isset($_POST['origin_address2']) ? $_POST['origin_address2'] : '';
		$origin_city = isset($_POST['origin_city']) ? $_POST['origin_city'] : '';
		$origin_state = isset($_POST['origin_state']) ? $_POST['origin_state'] : '';
		$origin_contact_postal_code = isset($_POST['origin_contact_postal_code']) ? $_POST['origin_contact_postal_code'] : '';
		$origin_country = isset($_POST['origin_country']) ? $_POST['origin_country'] : '';
		$origin_contact_name = isset($_POST['origin_contact_name']) ? $_POST['origin_contact_name'] : '';
		$origin_contact_phone_1 = isset($_POST['origin_contact_phone_1']) ? $_POST['origin_contact_phone_1'] : '';
		$origin_contact_email = isset($_POST['origin_contact_email']) ? $_POST['origin_contact_email'] : '';
		$origin_contact_phone_2 = isset($_POST['origin_contact_phone_2']) ? $_POST['origin_contact_phone_2'] : '';
		$origin_contact_phone_cell = isset($_POST['origin_contact_phone_cell']) ? $_POST['origin_contact_phone_cell'] : '';
		$origin_company_name = isset($_POST['origin_company_name']) ? $_POST['origin_company_name'] : '';

		$destination_saved_contact = isset($_POST['destination_saved_contact']) ? $_POST['destination_saved_contact'] : '';
		$destination_auction_site = isset($_POST['destination_auction_site']) ? $_POST['destination_auction_site'] : '';
		$destination_terminal = isset($_POST['destination_terminal']) ? $_POST['destination_terminal'] : '';
		$destination_type = isset($_POST['destination_type']) ? $_POST['destination_type'] : '';
		$destination_address = isset($_POST['destination_address']) ? $_POST['destination_address'] : '';
		$destination_address2 = isset($_POST['destination_address2']) ? $_POST['destination_address2'] : '';
		$destination_city = isset($_POST['destination_city']) ? $_POST['destination_city'] : '';
		$destination_state = isset($_POST['destination_state']) ? $_POST['destination_state'] : '';
		$destination_contact_postal_code = isset($_POST['destination_contact_postal_code']) ? $_POST['destination_contact_postal_code'] : '';
		$destination_country = isset($_POST['destination_country']) ? $_POST['destination_country'] : '';
		$destination_contact_name = isset($_POST['destination_contact_name']) ? $_POST['destination_contact_name'] : '';
		$destination_contact_phone_1 = isset($_POST['destination_contact_phone_1']) ? $_POST['destination_contact_phone_1'] : '';
		$destination_contact_email = isset($_POST['destination_contact_email']) ? $_POST['destination_contact_email'] : '';
		$destination_contact_phone_2 = isset($_POST['destination_contact_phone_2']) ? $_POST['destination_contact_phone_2'] : '';
		$destination_contact_phone_cell = isset($_POST['destination_contact_phone_cell']) ? $_POST['destination_contact_phone_cell'] : '';
		$destination_company_name = isset($_POST['destination_company_name']) ? $_POST['destination_company_name'] : '';

	    // Si el ID del rol está presente, hacemos un UPDATE
	    if($customerId != ''){
	        $query = "INSERT INTO orders (origin_saved_contact, origin_auction_site, origin_terminal, origin_type, origin_address, origin_address2, origin_city, origin_state, origin_contact_postal_code, origin_country, origin_contact_name, origin_contact_phone_1, origin_contact_email, origin_contact_phone_2, origin_contact_phone_cell, origin_company_name, destination_saved_contact, destination_auction_site, destination_terminal, destination_type, destination_address, destination_address2, destination_city, destination_state, destination_contact_postal_code, destination_country, destination_contact_name, destination_contact_phone_1, destination_contact_email, destination_contact_phone_2, destination_contact_phone_cell, destination_company_name,id_customer,shipment_first_avalilable_pickup_date, transport_type_id,assigned_user_id)
        VALUES ('$origin_saved_contact', '$origin_auction_site', '$origin_terminal', '$origin_type', '$origin_address', '$origin_address2', '$origin_city', '$origin_state', '$origin_contact_postal_code', '$origin_country', '$origin_contact_name', '$origin_contact_phone_1', '$origin_contact_email', '$origin_contact_phone_2', '$origin_contact_phone_cell', '$origin_company_name', '$destination_saved_contact', '$destination_auction_site', '$destination_terminal', '$destination_type', '$destination_address', '$destination_address2', '$destination_city', '$destination_state', '$destination_contact_postal_code', '$destination_country', '$destination_contact_name', '$destination_contact_phone_1', '$destination_contact_email', '$destination_contact_phone_2', '$destination_contact_phone_cell', '$destination_company_name','$customerId','$firstAvailablePickupDate',$transportType,$assignedUserId)";
    error_log($query);
	        $execute_query = $conn->query($query);

	        if($execute_query){
	            $message = 'New order saved successfully!';
	        }else{
	            $error = 'ERROR saving new order: '.$conn->error;
	        }
	    } 

	    $jsondata['message'] = $message;
	    $jsondata['error']   = $error;
	    echo json_encode($jsondata);
	}

	function getZipInfoFunction(){
		global $conn;
		$jsondata = array();
		$error = '';
		$data = array();

		$zipcode = $_POST['zipcode'];

		$query = "SELECT state,state_abbr,zipcode,town,city,country
					FROM geo_data 
					WHERE zipcode = $zipcode
					";
					//error_log($query);
		$result = $conn->query($query);

		if ($result) {
			$data = $result->fetch_assoc();
		} else {
			$error = 'Error fetching zipcode data: '.$conn->error;
		}
//error_log(print_r($data,true));
		$jsondata['data'] = $data;
		$jsondata['error'] = $error;
		echo json_encode($jsondata);
	}

	function loadZipCodesFunction(){
		global $conn;
		$jsondata = array();
		$error = '';
		$data = array();
		$userId    = isset($_POST['user_id']) ? $_POST['user_id'] : '';

		$query = "SELECT zipcode, city, town, country
					FROM geo_data ";

		$execute_query = $conn->query($query);

		if($execute_query){
			
			while($row = $execute_query->fetch_array()){
				$data[] = array(
					'zip' 		=> $row['zipcode'],
					'city' 		=> $row['city'],
					'town' 		=> $row['town'],
					'country' 	=> $row['country']
				);
			}
			
		}else{
			$error = 'Error: '.$conn->error;
		}
//error_log(print_r($data,true));
		$jsondata['data']		= $data;
		$jsondata['error']   	= $error;
		echo json_encode($jsondata);
	}

	function getCustomerInfoFunction(){
		global $conn;
		$jsondata = array();
		$error = '';
		$data = array();

		$customerId = $_POST['customer_id'];

		$query = "SELECT id_customer, name, last_name, phone, email, company, state, zip, country, assigned_to, status, city, billing_address 
					FROM customers 
					WHERE id_customer = $customerId";
					//error_log($query);
		$result = $conn->query($query);

		if ($result) {
			$data = $result->fetch_assoc();
		} else {
			$error = 'Error fetching user data: '.$conn->error;
		}

		$jsondata['data'] = $data;
		$jsondata['error'] = $error;
		echo json_encode($jsondata);
	}

	function loadTransportTypeFunction(){
		global $conn;
		$jsondata = array();
		$error = '';
		$data = array();
		$userId    = isset($_POST['user_id']) ? $_POST['user_id'] : '';

		$query = "SELECT id, name, status
					FROM transport_type ";

		$execute_query = $conn->query($query);

		if($execute_query){
			
			while($row = $execute_query->fetch_array()){
				$data[] = array(
					'id' 		=> $row['id'],
					'name' 		=> $row['name'],
					'status' 	=> $row['status']
				);
			}
			
		}else{
			$error = 'Error: '.$conn->error;
		}
//error_log(print_r($data,true));
		$jsondata['data']		= $data;
		$jsondata['error']   	= $error;
		echo json_encode($jsondata);
	}

	function loadPhonesFunction(){
		global $conn;
		$jsondata = array();
		$error = '';
		$data = array();
		$userId    = isset($_POST['user_id']) ? $_POST['user_id'] : '';

		$query = "SELECT id_customer, name, last_name, phone, email, company, state, zip, country, assigned_to, status, city, billing_address 
					FROM customers ";

		$execute_query = $conn->query($query);

		if($execute_query){
			
			while($row = $execute_query->fetch_array()){
				$data[] = array(
					'id_customer' 		=> $row['id_customer'],
					'name' 				=> $row['name'],
					'last_name' 		=> $row['last_name'],
					'phone' 			=> $row['phone'],
					'email'				=> $row['email'],
					'company'			=> $row['company'],
					'state'				=> $row['state'],
					'zip'				=> $row['zip'],
					'country'			=> $row['country'],
					'assigned_to'		=> $row['assigned_to'],
					'status'			=> $row['status'],
					'city'				=> $row['city'],
					'billing_address'	=> $row['billing_address']
				);
			}
			
		}else{
			$error = 'Error: '.$conn->error;
		}
//error_log(print_r($data,true));
		$jsondata['data']		= $data;
		$jsondata['error']   	= $error;
		echo json_encode($jsondata);
	}

	function getUserInfoFunction(){
		global $conn;
		$jsondata = array();
		$error = '';
		$data = array();

		$userId = $_POST['user_id'];

		$query = "SELECT name, last_name, email, role FROM users WHERE id = $userId";
		$result = $conn->query($query);

		if ($result) {
			$data = $result->fetch_assoc();
		} else {
			$error = 'Error fetching user data: '.$conn->error;
		}

		$jsondata['data'] = $data;
		$jsondata['error'] = $error;
		echo json_encode($jsondata);
	}

	function updateUserStatusFunction(){
		global $conn;
		$user_id = $_POST['user_id'];
		$status = $_POST['status'];

		$query = "UPDATE users SET status = ? WHERE id = ?";
		$stmt = $conn->prepare($query);
		$stmt->bind_param("ii", $status, $user_id);

		if($stmt->execute()){
			$jsondata['error'] = '';
			$jsondata['message'] = 'User was updated successfully!';
		} else {
			$jsondata['error'] = 'ERROR: ' . $conn->error;
		}

		echo json_encode($jsondata);
	}

	function saveUserFunction(){
	    global $conn;
	    $jsondata = array();
	    $error = '';
	    $message = '';

	    $userName = $_POST['user_name'];
	    $userLastName = $_POST['user_lastname'];
	    $userEmail = $_POST['user_email'];
	    $userPassword = password_hash($_POST['user_password'], PASSWORD_DEFAULT);
	    $userRole = $_POST['user_role'];

	    $query = "INSERT INTO users (name, last_name, email, code, role, status, creation_date) 
	            VALUES ('$userName', '$userLastName', '$userEmail', '$userPassword', $userRole, 1, NOW())";

	    if ($conn->query($query)) {
	        $message = 'User saved successfully!';
	    } else {
	        $error = 'Error saving user: '.$conn->error;
	    }

	    $jsondata['message'] = $message;
	    $jsondata['error'] = $error;
	    echo json_encode($jsondata);
	}

	function updateUserFunction(){
	    global $conn;
	    $jsondata = array();
	    $error = '';
	    $message = '';

	    $userId = $_POST['user_id'];
	    $userName = $_POST['user_name'];
	    $userLastName = $_POST['user_lastname'];
	    $userEmail = $_POST['user_email'];
	    $userRole = $_POST['user_role'];

	    $query = "UPDATE users SET name = '$userName', last_name = '$userLastName', email = '$userEmail', role = $userRole WHERE id = $userId";

	    // Verificar si se incluye un cambio de contraseña
	    if (isset($_POST['user_password']) && $_POST['user_password'] !== '') {
	        $userPassword = password_hash($_POST['user_password'], PASSWORD_DEFAULT);
	        $query = "UPDATE users SET name = '$userName', last_name = '$userLastName', email = '$userEmail', role = $userRole, code = '$userPassword' WHERE id = $userId";
	    }

	    if ($conn->query($query)) {
	        $message = 'User updated successfully!';
	    } else {
	        $error = 'Error updating user: '.$conn->error;
	    }

	    $jsondata['message'] = $message;
	    $jsondata['error'] = $error;
	    echo json_encode($jsondata);
	}

	function loadUsersFunction() {
	  global $conn;
	  $jsondata = array();
	  $error 	= '';
	  $data 	= array();
	  $roles 	= array();

	  $query = "SELECT 
	  				id, 
	  				CONCAT(u.name, ' ', last_name) as name, 
	  				DATE_FORMAT(creation_date, '%d-%m-%Y') as date_created, 
	  				r.name as role, 
	  				u.status 
	  			FROM users u
	  			INNER JOIN roles r
	  			ON u.role = r.id_roles";
//error_log($query);
	  $result = $conn->query($query);

	  if ($result) {
	    while ($row = $result->fetch_assoc()) {
	      $data[] = $row;
	    }
	  } else {
	    $error = 'Error fetching data: '.$conn->error;
	  }

		$query = "SELECT id_roles, name FROM roles WHERE status = 1";
		$result = $conn->query($query);

		if ($result) {
			while ($row = $result->fetch_assoc()) {
			  $roles[] = $row;
			}
		} else {
			$error = 'Error fetching data: '.$conn->error;
		}

		$jsondata['roles'] 	= $roles;
		$jsondata['data'] 	= $data;
		$jsondata['error'] 	= $error;
		echo json_encode($jsondata);
	}

	function updateRoleStatusFunction(){
		global $conn;
		$role_id = $_POST['role_id'];
	    $status = $_POST['status'];

	    $query = "UPDATE roles SET status = ? WHERE id_roles = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("ii", $status, $role_id);

	    if($stmt->execute()){
	        $jsondata['error'] = '';
	        $jsondata['message'] = 'Role was updated successfully!';
	    } else {
	        $jsondata['error'] = 'ERROR: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	function loadRoleFunction(){
		global $conn;
		$jsondata  	= array();
		$error 	   	= '';
		$message   	= '';
		$data 		= array();

		$query = "SELECT id_roles, name, last_modified, status 
					FROM roles r 
		";

		$execute_query = $conn->query($query);

		if($execute_query){
			
			while($row = $execute_query->fetch_array()){
				$data[] = array(
					'id' 			=> $row['id_roles'],
					'role_name' 	=> $row['name'],
					'last_modified' => $row['last_modified'],
					'status' 		=> $row['status']
				);
			}
			
		}else{
			$error = 'Error: '.$conn->error;
		}
		
		$jsondata['data']		= $data;
		$jsondata['message'] 	= $message;
		$jsondata['error']   	= $error;
		echo json_encode($jsondata);
	}

	function saveRoleFunction(){
	    global $conn;
	    $jsondata   = array();
	    $error      = '';
	    $message    = '';
	    $role       = $_POST['role_txt'];
	    $role_id    = isset($_POST['role_id']) ? $_POST['role_id'] : '';

	    // Si el ID del rol está presente, hacemos un UPDATE
	    if($role_id != ''){
	        $query = "UPDATE roles SET name='$role', last_modified=NOW() WHERE id_roles='$role_id'";
	        $execute_query = $conn->query($query);

	        if($execute_query){
	            $message = 'Role updated successfully!';
	        }else{
	            $error = 'ERROR updating role: '.$conn->error;
	        }
	    } 
	    // Si no hay ID, hacemos un INSERT
	    else {
	        $query = "INSERT INTO roles(name,last_modified,status) VALUES ('$role',NOW(),1)";
	        $execute_query = $conn->query($query);

	        if($execute_query){
	            $message = 'Role saved correctly!';
	        }else{
	            $error = 'ERROR inserting role: '.$conn->error;
	        }
	    }

	    $jsondata['message'] = $message;
	    $jsondata['error']   = $error;
	    echo json_encode($jsondata);
	}

	function signInFunction(){
		global $conn;
		$jsondata  	= array();
		$error 	   	= '';
		$message   	= '';
		$email 		= $_POST['email'];
		$pass 		= $_POST['pass'];
		$code 		= '';
		
		$query = "SELECT id, name, last_name, email, code 
					FROM users u 
					WHERE email = '$email'
		";

		//$hashed_password = password_hash('1234', PASSWORD_DEFAULT);
//error_log($hashed_password);

		$execute_query = $conn->query($query);

		if($execute_query){
			
			while($row = $execute_query->fetch_array()){
				$id 		= $row['id'];
				$name 		= $row['name'];
				$last_name 	= $row['last_name'];
				$email 		= $row['email'];
				$code 		= $row['code'];	
		
			}

			if (password_verify($pass, $code)) {
			    $message = "Welcome $name $last_name";
			} else {
			    $error = 'Wrong password or user!';
			}
			
		}else{
			$error = 'Error: '.$conn->error;
		}
		
		$jsondata['message'] 	= $message;
		$jsondata['error']   	= $error;
		echo json_encode($jsondata);
	}

	function connectFunction($command,$table,$fields,$where = ''){
		global $conn;
		$jsondata  = array();
		$error 	   = '';
		$message   = '';
		$data_rows = array();
		$f 		   = '';
		$while_statement = '';
		$data_rows_txt = '';


		// Este query lista todos los documentos en estado de "En Documentación"
		$query = "SELECT id, name, last_name, email, code 
					FROM users u 
					WHERE id = 1;
				 ";
		$execute_query = $conn->query($query);

		if($execute_query){
			
			while($row = $execute_query->fetch_array()){
				$id 	= $row['id'];
				$nombre = $row['name'];
				$codigo = $row['code'];	
				$data_rows[] = array(
					'id' => $id,
					'nombre' => $nombre,
					'codigo' => $codigo
				);
			}
			
		}else{
			$error = 'Error: '.$conn->error;
		}
//error_log(print_r($data_rows,true));
		$jsondata['message'] 	= $data_rows;
		$jsondata['error']   	= $error;
		echo json_encode($jsondata);
	}
  
?>
