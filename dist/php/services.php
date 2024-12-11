<?php
//error_log('Reconoce PHP');
	session_start();
	date_default_timezone_set('America/Guatemala');
	header('Content-Type: application/json');

	function checkSession() {
	    // Rutas que no requieren autenticación
	    $publicRoutes = ['sign_in', 'connect'];
	    
	    // Si es una ruta pública, permitir el acceso
	    if (isset($_POST['option']) && in_array($_POST['option'], $publicRoutes)) {
	        return true;
	    }
	    
	    // Verificar si el usuario está autenticado
	    if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
	        echo json_encode([
	            'error' => 'Session expired or not authenticated',
	            'redirect' => '../index.html'
	        ]);
	        exit;
	    }
	    
	    // Verificar tiempo de inactividad (opcional)
	    $inactivityTimeout = 30 * 60; // 30 minutos
	    if (isset($_SESSION['login_time']) && (time() - $_SESSION['login_time'] > $inactivityTimeout)) {
	        session_destroy();
	        echo json_encode([
	            'error' => 'Session expired',
	            'redirect' => '../index.html'
	        ]);
	        exit;
	    }
	    
	    // Actualizar tiempo de última actividad
	    $_SESSION['login_time'] = time();
	    
	    return true;
	}

	// Evitar cualquier salida antes de la respuesta JSON
	ob_start();

	require_once('connect.php');

	if(isset($_POST['option'])){
		$option = $_POST['option'];
		
		// Verificar sesión
    	checkSession();
		
		switch ($option) {
			case 'connect':
				connectFunction();
				break;
			case 'sign_in':
				signInFunction();
				break;
			case 'logout':
			    logoutFunction();
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
			case 'load_carriers':
			    loadCarriersFunction();
			    break;
			case 'load_referral_sources':
			    loadReferralSourcesFunction();
			    break;
			case 'load_teams':
			    loadTeamsFunction();
			    break;
			case 'load_customers':
		        loadCustomersFunction();
		        break;
		    case 'load_companies_select':
		        loadCompaniesSelectFunction();
		        break;
		    case 'load_referral_sources_select':
        		loadReferralSourcesSelectFunction();
        		break;
			case 'load_users_select':
		        loadUsersSelectFunction();
		        break;
		    case 'load_teams_select':
		        loadTeamsSelectFunction();
		        break;
		    case 'load_roles_for_permissions':
			   loadRolesForPermissionsFunction();
			   break;
			case 'load_role_permissions':
			   loadRolePermissionsFunction(); 
			   break;
			case 'load_sidebar':
				loadSidebarFunction();
			    break;
			case 'load_vehicles':
			    loadVehiclesFunction();
			    break;
			case 'load_carriers_select':
		        loadCarriersSelectFunction();
		        break;
		    case 'load_drivers':
			    loadDriversFunction();
			    break;
			case 'load_drivers_select':
			    loadDriversSelectFunction();
			    break;
		    case 'load_interested_carriers':
		        loadInterestedCarriersFunction();
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
			case 'save_carrier':
			    saveCarrierFunction();
			    break;
			case 'save_referral_source':
			    saveReferralSourceFunction();
			    break;
			case 'save_team':
			    saveTeamFunction();
			    break;
			case 'save_customer':
		        saveCustomerFunction();
		        break;
		    case 'save_permissions':
			   savePermissionsFunction();
			   break;
			case 'save_vehicle':
			    saveVehicleFunction();
			    break;
			case 'save_driver':
			    saveDriverFunction();
			    break;
		    case 'save_interested_carrier':
		        saveInterestedCarrierFunction();
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
			case 'update_team_members':
			    updateTeamMembersFunction();
			    break;
			case 'update_customer_status':
		        updateCustomerStatusFunction();
		        break;
		    case 'update_vehicle_status':
			    updateVehicleStatusFunction();
			    break;
		    case 'update_interested_carrier_status':
		        updateInterestedCarrierStatusFunction();
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
			case 'get_carrier_info':
			    getCarrierInfoFunction();
			    break;
			case 'get_referral_source_info':
			    getReferralSourceInfoFunction();
			    break;
			case 'get_team_info':
			    getTeamInfoFunction();
			    break;
			case 'get_available_users':
			    getAvailableUsersFunction();
			    break;
		    case 'get_vehicle_info':
			    getVehicleInfoFunction();
			    break;
			case 'get_driver_info':
			    getDriverInfoFunction();
			    break;
			case 'get_driver_phone':
			    getDriverPhoneFunction();
			    break;
			case 'get_interested_carrier_info':
		        getInterestedCarrierInfoFunction();
		        break;

	        case 'load_insurance_policies':
			    loadInsurancePoliciesFunction();
			    break;
			case 'get_policy_info':
			    getPolicyInfoFunction();
			    break;
			case 'save_insurance_policy':
			    saveInsurancePolicyFunction();
			    break;
			case 'update_policy_status':
			    updatePolicyStatusFunction();
			    break;
			case 'load_insurance_policies_select':
			    loadInsurancePoliciesSelectFunction();
			    break;

			case 'load_payments':
			    loadPaymentsFunction();
			    break;
			case 'save_payment':
			    savePaymentFunction();
			    break;
			case 'get_payment_info':
			    getPaymentInfoFunction();
			    break;
			case 'update_payment_status':
			    updatePaymentStatusFunction();
			    break;
			case 'load_orders_select':
			    loadOrdersSelectFunction();
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

	function loadPaymentsFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];

	    $query = "SELECT p.id, p.order_id, DATE_FORMAT(p.payment_date, '%Y-%m-%d') as payment_date, 
	              p.payment_type, p.payment_direction, p.payment_amount, p.identification,
	              p.status, DATE_FORMAT(p.date_created, '%d-%m-%Y') as date_created
	              FROM payments p 
	              ORDER BY p.date_created DESC";

	    $result = $conn->query($query);

	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading payments: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	function savePaymentFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];

	    try {
	        $paymentData = json_decode($_POST['payment_data'], true);
	        $paymentId = isset($_POST['payment_id']) ? $_POST['payment_id'] : null;

	        if ($paymentId) {
	            $query = "UPDATE payments SET 
	                     order_id = ?, payment_date = ?, payment_type = ?,
	                     payment_direction = ?, payment_amount = ?,
	                     identification = ?, note = ?
	                     WHERE id = ?";
	            
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param(
	                "isssdssi",
	                $paymentData['order_id'],
	                $paymentData['payment_date'],
	                $paymentData['payment_type'],
	                $paymentData['payment_direction'],
	                $paymentData['payment_amount'],
	                $paymentData['identification'],
	                $paymentData['note'],
	                $paymentId
	            );
	        } else {
	            $query = "INSERT INTO payments (
	                     order_id, payment_date, payment_type,
	                     payment_direction, payment_amount,
	                     identification, note, status
	                     ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)";
	            
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param(
	                "isssdss",
	                $paymentData['order_id'],
	                $paymentData['payment_date'],
	                $paymentData['payment_type'],
	                $paymentData['payment_direction'],
	                $paymentData['payment_amount'],
	                $paymentData['identification'],
	                $paymentData['note']
	            );
	        }

	        if ($stmt->execute()) {
	            $jsondata['message'] = $paymentId ? 'Payment updated successfully!' : 'Payment saved successfully!';
	        } else {
	            throw new Exception($stmt->error);
	        }
	    } catch (Exception $e) {
	        $jsondata['error'] = 'Error: ' . $e->getMessage();
	    }

	    echo json_encode($jsondata);
	}

	function getPaymentInfoFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => null];

	    $paymentId = $_POST['payment_id'];
	    
	    $query = "SELECT * FROM payments WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("i", $paymentId);

	    if ($stmt->execute()) {
	        $result = $stmt->get_result();
	        $jsondata['data'] = $result->fetch_assoc();
	    } else {
	        $jsondata['error'] = 'Error fetching payment data: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	function updatePaymentStatusFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];

	    $paymentId = $_POST['payment_id'];
	    $status = $_POST['status'];

	    $query = "UPDATE payments SET status = ? WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("ii", $status, $paymentId);

	    if ($stmt->execute()) {
	        $jsondata['message'] = 'Payment status updated successfully!';
	    } else {
	        $jsondata['error'] = 'Error updating payment status: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	function loadInsurancePoliciesSelectFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];

	    $query = "SELECT ip.id, ip.policy_number
	              FROM insurance_policies ip
	              WHERE ip.status = 1";

	    $result = $conn->query($query);

	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading insurance policies';
	    }
//error_log(json_encode($jsondata));
	    echo json_encode($jsondata);
	}

	// Load insurance policies list
	function loadInsurancePoliciesFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];

	    $query = "SELECT id, policy_number, insurance_company, 
	              DATE_FORMAT(expiration_date, '%Y-%m-%d') as expiration_date,
	              liability_amount, cargo_amount, document_name, document_path,
	              DATE_FORMAT(date_created, '%d-%m-%Y') as date_created,
	              status
	              FROM insurance_policies 
	              ORDER BY date_created DESC";

	    $result = $conn->query($query);

	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading insurance policies: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	// Get insurance policy information
	function getPolicyInfoFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => null];

	    $policyId = $_POST['policy_id'];
	    
	    $query = "SELECT id, policy_number, insurance_company, 
	              DATE_FORMAT(expiration_date, '%Y-%m-%d') as expiration_date,
	              liability_amount, cargo_amount, document_name, document_path
	              FROM insurance_policies 
	              WHERE id = ?";
	              
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("i", $policyId);

	    if ($stmt->execute()) {
	        $result = $stmt->get_result();
	        $jsondata['data'] = $result->fetch_assoc();
	    } else {
	        $jsondata['error'] = 'Error fetching policy data: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	// Save or update insurance policy
	function saveInsurancePolicyFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];

	    try {
	        $conn->begin_transaction();

	        $policyData = json_decode($_POST['policy_data'], true);
	        $policyId = isset($_POST['policy_id']) ? $_POST['policy_id'] : null;

	        // Handle file upload if present
	        $documentPath = null;
	        if (isset($_FILES['insurance_document']) && $_FILES['insurance_document']['error'] === UPLOAD_ERR_OK) {
	            $uploadDir = '../uploads/insurance_documents/';
	            if (!file_exists($uploadDir)) {
	                mkdir($uploadDir, 0777, true);
	            }

	            $fileName = time() . '_' . basename($_FILES['insurance_document']['name']);
	            $targetPath = $uploadDir . $fileName;

	            if (move_uploaded_file($_FILES['insurance_document']['tmp_name'], $targetPath)) {
	                $documentPath = 'uploads/insurance_documents/' . $fileName;
	            } else {
	                throw new Exception("Error uploading file");
	            }
	        }

	        if ($policyId) {
	            // Update existing policy
	            $query = "UPDATE insurance_policies SET 
	                    policy_number = ?, 
	                    insurance_company = ?,
	                    expiration_date = ?,
	                    liability_amount = ?,
	                    cargo_amount = ?,
	                    document_name = ?" .
	                    ($documentPath ? ", document_path = ?" : "") .
	                    " WHERE id = ?";

	            $stmt = $conn->prepare($query);
	            
	            if ($documentPath) {
	                $stmt->bind_param(
	                    "sssddssi",
	                    $policyData['policy_number'],
	                    $policyData['insurance_company'],
	                    $policyData['expiration_date'],
	                    $policyData['liability_amount'],
	                    $policyData['cargo_amount'],
	                    $policyData['document_name'],
	                    $documentPath,
	                    $policyId
	                );
	            } else {
	                $stmt->bind_param(
	                    "sssddsi",
	                    $policyData['policy_number'],
	                    $policyData['insurance_company'],
	                    $policyData['expiration_date'],
	                    $policyData['liability_amount'],
	                    $policyData['cargo_amount'],
	                    $policyData['document_name'],
	                    $policyId
	                );
	            }

	            if (!$stmt->execute()) {
	                throw new Exception("Error updating policy: " . $stmt->error);
	            }

	            $jsondata['message'] = 'Insurance policy updated successfully!';
	        } else {
	            // Insert new policy
	            $query = "INSERT INTO insurance_policies (
	                    policy_number, insurance_company, expiration_date,
	                    liability_amount, cargo_amount, document_name" .
	                    ($documentPath ? ", document_path" : "") . ")
	                    VALUES (?, ?, ?, ?, ?, ?" . ($documentPath ? ", ?" : "") . ")";

	            $stmt = $conn->prepare($query);

	            if ($documentPath) {
	                $stmt->bind_param(
	                    "sssddss",
	                    $policyData['policy_number'],
	                    $policyData['insurance_company'],
	                    $policyData['expiration_date'],
	                    $policyData['liability_amount'],
	                    $policyData['cargo_amount'],
	                    $policyData['document_name'],
	                    $documentPath
	                );
	            } else {
	                $stmt->bind_param(
	                    "sssdds",
	                    $policyData['policy_number'],
	                    $policyData['insurance_company'],
	                    $policyData['expiration_date'],
	                    $policyData['liability_amount'],
	                    $policyData['cargo_amount'],
	                    $policyData['document_name']
	                );
	            }

	            if (!$stmt->execute()) {
	                throw new Exception("Error saving policy: " . $stmt->error);
	            }

	            $jsondata['message'] = 'Insurance policy saved successfully!';
	        }

	        $conn->commit();
	    } catch (Exception $e) {
	        $conn->rollback();
	        $jsondata['error'] = $e->getMessage();
	    }

	    echo json_encode($jsondata);
	}

	// Update insurance policy status
	function updatePolicyStatusFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];

	    $policyId = $_POST['policy_id'];
	    $status = $_POST['status'];

	    $query = "UPDATE insurance_policies SET status = ? WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("ii", $status, $policyId);

	    if ($stmt->execute()) {
	        $jsondata['message'] = 'Policy status updated successfully!';
	    } else {
	        $jsondata['error'] = 'Error updating policy status: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	function loadDriversSelectFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];

	    $query = "SELECT id, name, phone 
	              FROM drivers
	              WHERE status = 1
	              ORDER BY name";

	    $result = $conn->query($query);

	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading drivers';
	    }

	    echo json_encode($jsondata);
	}

	function getDriverPhoneFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => null];

	    $driverId = $_POST['driver_id'];
	    
	    $query = "SELECT phone FROM drivers WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("i", $driverId);

	    if ($stmt->execute()) {
	        $result = $stmt->get_result();
	        $jsondata['data'] = $result->fetch_assoc();
	    } else {
	        $jsondata['error'] = 'Error fetching driver phone: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	// Load drivers list
	function loadDriversFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];

	    $query = "SELECT id, name, phone, email, 
	              DATE_FORMAT(date_created, '%d-%m-%Y') as date_created, status
	              FROM drivers 
	              ORDER BY name";

	    $result = $conn->query($query);

	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading drivers: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	// Get driver information
	function getDriverInfoFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => null];

	    $driverId = $_POST['driver_id'];
	    
	    $query = "SELECT * FROM drivers WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("i", $driverId);

	    if ($stmt->execute()) {
	        $result = $stmt->get_result();
	        $jsondata['data'] = $result->fetch_assoc();
	    } else {
	        $jsondata['error'] = 'Error fetching driver data: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	// Save or update driver
	function saveDriverFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];

	    try {
	        $driverData = json_decode($_POST['driver_data'], true);
	        $driverId = isset($_POST['driver_id']) ? $_POST['driver_id'] : null;

	        if ($driverId) {
	            // Update existing driver
	            $query = "UPDATE drivers SET 
	                     name = ?, phone = ?, is_phone_mobile = ?,
	                     phone2 = ?, is_phone2_mobile = ?, email = ?
	                     WHERE id = ?";
	            
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param(
	                "ssisssi",
	                $driverData['name'], 
	                $driverData['phone'],
	                $driverData['is_phone_mobile'],
	                $driverData['phone2'],
	                $driverData['is_phone2_mobile'],
	                $driverData['email'],
	                $driverId
	            );

	            if ($stmt->execute()) {
	                $jsondata['message'] = 'Driver updated successfully!';
	            } else {
	                throw new Exception("Error updating driver: " . $stmt->error);
	            }
	        } else {
	            // Insert new driver
	            $query = "INSERT INTO drivers (
	                     name, phone, is_phone_mobile,
	                     phone2, is_phone2_mobile, email, status
	                     ) VALUES (?, ?, ?, ?, ?, ?, 1)";
	            
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param(
	                "ssisss",
	                $driverData['name'], 
	                $driverData['phone'],
	                $driverData['is_phone_mobile'],
	                $driverData['phone2'],
	                $driverData['is_phone2_mobile'],
	                $driverData['email']
	            );

	            if ($stmt->execute()) {
	                $jsondata['message'] = 'Driver saved successfully!';
	            } else {
	                throw new Exception("Error saving driver: " . $stmt->error);
	            }
	        }
	    } catch (Exception $e) {
	        $jsondata['error'] = $e->getMessage();
	    }

	    echo json_encode($jsondata);
	}

	function getInterestedCarrierInfoFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => null];

	    $id = $_POST['id'];

	    $query = "SELECT 
	                ic.id,
	                ic.carrier_id,
	                c.name as carrier_name,
	                ic.carrier_status,
	                c.carrier_main_contact as contact,
	                c.phone,
	                DATE_FORMAT(ic.pickup_date, '%Y-%m-%d') as pickup_date,
	                DATE_FORMAT(ic.delivery_date, '%Y-%m-%d') as delivery_date,
	                ic.carrier_pay,
	                ic.special_instructions,
	                ic.internal_note,
	                ic.pickup_window,
	                ic.delivery_window,
	                ic.insurance_policy_id,
	                ic.driver_id
	            FROM interested_carriers ic
	            INNER JOIN carriers c ON ic.carrier_id = c.id
	            WHERE ic.id = ?";

	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("i", $id);

	    if ($stmt->execute()) {
	        $result = $stmt->get_result();
	        $jsondata['data'] = $result->fetch_assoc();
	    } else {
	        $jsondata['error'] = 'Error fetching interested carrier data: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	function loadCarriersSelectFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];

	    $query = "SELECT id, name 
	              FROM carriers
	              WHERE status = 1
	              ORDER BY name";

	    $result = $conn->query($query);

	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading carriers';
	    }
//error_log('load_carriers_select response: ' . json_encode($jsondata));
	    echo json_encode($jsondata);
	}

	function loadInterestedCarriersFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];
	    
	    $query = "SELECT ic.id, c.name as carrier_name, ic.carrier_status, 
	                     c.carrier_main_contact as contact, c.phone,
	                     DATE_FORMAT(ic.pickup_date, '%Y-%m-%d') as pickup_date,
	                     DATE_FORMAT(ic.delivery_date, '%Y-%m-%d') as delivery_date,
	                     ic.status
	              FROM interested_carriers ic
	              INNER JOIN carriers c ON ic.carrier_id = c.id
	              ORDER BY ic.date_created DESC";
	    
	    $result = $conn->query($query);
	    
	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading interested carriers: ' . $conn->error;
	    }
	    
	    echo json_encode($jsondata);
	}

function saveInterestedCarrierFunction() {
	error_log ('llamando a salvar carrier');
    global $conn;
    $jsondata = ['error' => '', 'message' => ''];
    $updateId = $_POST['id'];
    try {
        $carrierData = json_decode($_POST['carrier_data'], true);
        $carrierId = isset($_POST['carrier_id']) ? $_POST['carrier_id'] : null;

        if ($updateId!=='') {
            // Update
            $query = "UPDATE interested_carriers SET 
                     carrier_id = '$carrierData[carrier_id]', carrier_status = '$carrierData[carrier_status]', carrier_pay = '$carrierData[carrier_pay]',
                     special_instructions = '$carrierData[special_instructions]', internal_note = '$carrierData[internal_note]',
                     pickup_date = '$carrierData[pickup_date]', pickup_window = '$carrierData[pickup_window]',
                     delivery_date = '$carrierData[delivery_date]', delivery_window = '$carrierData[delivery_window]',
                     insurance_policy_id = " . ($carrierData['insurance_policy_id'] ? $carrierData['insurance_policy_id'] : 'null') . ", 
                     driver_id = " . ($carrierData['driver_id'] ? $carrierData['driver_id'] : 'null') . "
                     WHERE id = $updateId";

            $stmt = $conn->prepare($query);
            if (!$stmt) {
                $errorMessage = "Error preparing update query: " . $conn->error;
                error_log($errorMessage);
                throw new Exception($errorMessage);
            }

            if (!$stmt->execute()) {
                $errorMessage = "Error executing update query: " . $stmt->error;
                //error_log($errorMessage);
                throw new Exception($errorMessage);
            }

            $message = 'Interested carrier updated successfully!';
        } else {
            // Insert
            $query = "INSERT INTO interested_carriers (
                     carrier_id, carrier_status, carrier_pay,
                     special_instructions, internal_note,
                     pickup_date, pickup_window,
                     delivery_date, delivery_window,
                     insurance_policy_id, driver_id, status
                     ) VALUES (
                     '$carrierData[carrier_id]', '$carrierData[carrier_status]', '$carrierData[carrier_pay]',
                     '$carrierData[special_instructions]', '$carrierData[internal_note]',
                     '$carrierData[pickup_date]', '$carrierData[pickup_window]',
                     '$carrierData[delivery_date]', '$carrierData[delivery_window]',
                     " . ($carrierData['insurance_policy_id'] ? $carrierData['insurance_policy_id'] : 'null') . ", 
                     " . ($carrierData['driver_id'] ? $carrierData['driver_id'] : 'null') . ", 
                     1)";

            $stmt = $conn->prepare($query);
            if (!$stmt) {
                $errorMessage = "Error preparing insert query: " . $conn->error;
                //error_log($errorMessage);
                throw new Exception($errorMessage);
            }

            if (!$stmt->execute()) {
                $errorMessage = "Error executing insert query: " . $stmt->error;
                //error_log($errorMessage);
                throw new Exception($errorMessage);
            }

            $lastInsertId = $conn->insert_id;
            $message = 'Interested carrier saved successfully!';
            $jsondata['insertedId'] = $lastInsertId;
        }

        $jsondata['message'] = $message;
    } catch (Exception $e) {
        $jsondata['error'] = 'Error: ' . $e->getMessage();
    }

    echo json_encode($jsondata);
}

	function updateInterestedCarrierStatusFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];
	    
	    $id = $_POST['id'];
	    $status = $_POST['status'];
	    
	    $query = "UPDATE interested_carriers SET status = ? WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("ii", $status, $id);
	    
	    if ($stmt->execute()) {
	        $jsondata['message'] = 'Status updated successfully!';
	    } else {
	        $jsondata['error'] = 'Error updating status: ' . $conn->error;
	    }
	    
	    echo json_encode($jsondata);
	}

	function loadVehiclesFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];

	    $query = "SELECT id, model_year, make, model, vehicle_type, vin, 
	              DATE_FORMAT(date_created, '%d-%m-%Y') as date_created, status
	              FROM vehicles 
	              ORDER BY date_created DESC";

	    $result = $conn->query($query);

	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading vehicles: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	function getVehicleInfoFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => null];

	    $vehicleId = $_POST['vehicle_id'];
	    
	    $query = "SELECT * FROM vehicles WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("i", $vehicleId);

	    if ($stmt->execute()) {
	        $result = $stmt->get_result();
	        $jsondata['data'] = $result->fetch_assoc();
	    } else {
	        $jsondata['error'] = 'Error fetching vehicle data: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	function updateVehicleStatusFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];

	    $vehicleId = $_POST['vehicle_id'];
	    $status = $_POST['status'];

	    $query = "UPDATE vehicles SET status = ? WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("ii", $status, $vehicleId);

	    if ($stmt->execute()) {
	        $jsondata['message'] = 'Vehicle status updated successfully!';
	    } else {
	        $jsondata['error'] = 'Error updating vehicle status: ' . $conn->error;
	    }

	    echo json_encode($jsondata);
	}

	function saveVehicleFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];

	    try {
	        $vehicleData = json_decode($_POST['vehicle_data'], true);
	        $vehicleId = isset($_POST['vehicle_id']) ? $_POST['vehicle_id'] : null;

	        // Validar datos requeridos
	        if (empty($vehicleData['model_year']) || empty($vehicleData['make']) || empty($vehicleData['model'])) {
	            throw new Exception("Required fields are missing");
	        }

	        if ($vehicleId) {
	            // Update existing vehicle
	            $query = "UPDATE vehicles SET 
	                    model_year = ?,
	                    make = ?,
	                    model = ?,
	                    vehicle_type = ?,
	                    is_inop = ?,
	                    notes = ?,
	                    carrier_fee = ?,
	                    broker_fee = ?,
	                    vehicle_tariff = ?,
	                    vin = ?,
	                    plate_number = ?,
	                    lot_number = ?,
	                    color = ?,
	                    weight = ?,
	                    weight_measure = ?,
	                    mods = ?,
	                    vehicle_length = ?,
	                    vehicle_width = ?,
	                    vehicle_height = ?,
	                    add_on = ?
	                    WHERE id = ?";

	            $stmt = $conn->prepare($query);
	            if (!$stmt) {
	                throw new Exception("Error preparing update query: " . $conn->error);
	            }

	            // Convertir valores vacíos a NULL o valores por defecto
	            $modelYear = $vehicleData['model_year'] ?: null;
	            $make = $vehicleData['make'] ?: '';
	            $model = $vehicleData['model'] ?: '';
	            $vehicleType = $vehicleData['vehicle_type'] ?: '';
	            $isInop = (int)$vehicleData['is_inop'];
	            $notes = $vehicleData['notes'] ?: '';
	            $carrierFee = $vehicleData['carrier_fee'] ?: 0.00;
	            $brokerFee = $vehicleData['broker_fee'] ?: 0.00;
	            $vehicleTariff = $vehicleData['vehicle_tariff'] ?: 0.00;
	            $vin = $vehicleData['vin'] ?: '';
	            $plateNumber = $vehicleData['plate_number'] ?: '';
	            $lotNumber = $vehicleData['lot_number'] ?: '';
	            $color = $vehicleData['color'] ?: '';
	            $weight = $vehicleData['weight'] ?: 0.00;
	            $weightMeasure = $vehicleData['weight_measure'] ?: 'lbs';
	            $mods = $vehicleData['mods'] ?: '';
	            $length = $vehicleData['vehicle_length'] ?: 0.00;
	            $width = $vehicleData['vehicle_width'] ?: 0.00;
	            $height = $vehicleData['vehicle_height'] ?: 0.00;
	            $addOn = $vehicleData['add_on'] ?: '';

	            $stmt->bind_param(
	                "isssisdddssssdssdddsi",
	                $modelYear,
	                $make,
	                $model,
	                $vehicleType,
	                $isInop,
	                $notes,
	                $carrierFee,
	                $brokerFee,
	                $vehicleTariff,
	                $vin,
	                $plateNumber,
	                $lotNumber,
	                $color,
	                $weight,
	                $weightMeasure,
	                $mods,
	                $length,
	                $width,
	                $height,
	                $addOn,
	                $vehicleId
	            );
	            
	            $message = 'Vehicle updated successfully!';
	        } else {
	            // Insert new vehicle
	            $query = "INSERT INTO vehicles (
	                    model_year, make, model, vehicle_type, is_inop, notes,
	                    carrier_fee, broker_fee, vehicle_tariff, vin, plate_number,
	                    lot_number, color, weight, weight_measure, mods,
	                    vehicle_length, vehicle_width, vehicle_height, add_on, status
	                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";

	            $stmt = $conn->prepare($query);
	            if (!$stmt) {
	                throw new Exception("Error preparing insert query: " . $conn->error);
	            }

	            // Convertir valores vacíos a NULL o valores por defecto
	            $modelYear = $vehicleData['model_year'] ?: null;
	            $make = $vehicleData['make'] ?: '';
	            $model = $vehicleData['model'] ?: '';
	            $vehicleType = $vehicleData['vehicle_type'] ?: '';
	            $isInop = (int)$vehicleData['is_inop'];
	            $notes = $vehicleData['notes'] ?: '';
	            $carrierFee = $vehicleData['carrier_fee'] ?: 0.00;
	            $brokerFee = $vehicleData['broker_fee'] ?: 0.00;
	            $vehicleTariff = $vehicleData['vehicle_tariff'] ?: 0.00;
	            $vin = $vehicleData['vin'] ?: '';
	            $plateNumber = $vehicleData['plate_number'] ?: '';
	            $lotNumber = $vehicleData['lot_number'] ?: '';
	            $color = $vehicleData['color'] ?: '';
	            $weight = $vehicleData['weight'] ?: 0.00;
	            $weightMeasure = $vehicleData['weight_measure'] ?: 'lbs';
	            $mods = $vehicleData['mods'] ?: '';
	            $length = $vehicleData['vehicle_length'] ?: 0.00;
	            $width = $vehicleData['vehicle_width'] ?: 0.00;
	            $height = $vehicleData['vehicle_height'] ?: 0.00;
	            $addOn = $vehicleData['add_on'] ?: '';

	            $stmt->bind_param(
	                "isssisdddssssdssdddss",
	                $modelYear,
	                $make,
	                $model,
	                $vehicleType,
	                $isInop,
	                $notes,
	                $carrierFee,
	                $brokerFee,
	                $vehicleTariff,
	                $vin,
	                $plateNumber,
	                $lotNumber,
	                $color,
	                $weight,
	                $weightMeasure,
	                $mods,
	                $length,
	                $width,
	                $height,
	                $addOn
	            );
	            
	            $message = 'Vehicle saved successfully!';
	        }

	        if (!$stmt->execute()) {
	            throw new Exception("Error executing query: " . $stmt->error);
	        }

	        $jsondata['message'] = $message;

	    } catch (Exception $e) {
	        $jsondata['error'] = 'Error saving vehicle: ' . $e->getMessage();
	        error_log("Error in saveVehicleFunction: " . $e->getMessage());
	    }

	    echo json_encode($jsondata);
	}

	function loadSidebarFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];
	    
	    if (!isset($_SESSION['user_id'])) {
	        $jsondata['error'] = 'User session not found';
	        echo json_encode($jsondata);
	        return;
	    }
	    
	    try {
	        $roleId = $_SESSION['user_role'];
	        
	        $menuQuery = "SELECT DISTINCT m.*, 
	                     (SELECT COUNT(*) FROM menu_items mi WHERE mi.parent_id = m.id AND mi.status = 1) as child_count
	                     FROM menu_items m 
	                     INNER JOIN role_permissions rp ON m.id = rp.menu_item_id 
	                     WHERE rp.role_id = ? AND m.status = 1 
	                     ORDER BY COALESCE(m.parent_id, m.id), m.order_position";
	        
	        $stmt = $conn->prepare($menuQuery);
	        if (!$stmt) {
	            throw new Exception("Error preparing menu query: " . $conn->error);
	        }
	        
	        $stmt->bind_param("i", $roleId);
	        if (!$stmt->execute()) {
	            throw new Exception("Error executing menu query: " . $stmt->error);
	        }
	        
	        $result = $stmt->get_result();
	        
	        $menuItems = [];
	        while ($row = $result->fetch_assoc()) {
	            // Procesar la URL según el tipo de enlace
	            $url = $row['url'];
	            if ($url) {
	                // Si es el dashboard, mantener la URL tal cual
	                if ($url === 'dashboard.html') {
	                    $row['url'] = $url;
	                }
	                // Si es una URL externa, mantenerla tal cual
	                else if (preg_match('/^https?:\/\//', $url)) {
	                    $row['url'] = $url;
	                }
	                // Para el resto de URLs internas, asegurarnos de que no tengan 'pages/' al inicio
	                else {
	                    $row['url'] = ltrim($url, '/');
	                    if (strpos($row['url'], 'pages/') === 0) {
	                        $row['url'] = substr($row['url'], 6);
	                    }
	                }
	            }
	            
	            $menuItems[] = [
	                'id' => (int)$row['id'],
	                'name' => $row['name'],
	                'icon' => $row['icon'],
	                'url' => $row['url'],
	                'parent_id' => $row['parent_id'] ? (int)$row['parent_id'] : null,
	                'order_position' => (int)$row['order_position'],
	                'child_count' => (int)$row['child_count']
	            ];
	        }
	        
	        $jsondata['data'] = $menuItems;
	        
	    } catch (Exception $e) {
	        $jsondata['error'] = $e->getMessage();
	        error_log("Error in loadSidebarFunction: " . $e->getMessage());
	    }
	    
	    header('Content-Type: application/json');
	    echo json_encode($jsondata);
	    exit;
	}

	function loadRolesForPermissionsFunction() {
	   global $conn;
	   $jsondata = ['error' => '', 'data' => []];
	   
	   $query = "SELECT id_roles as id, name FROM roles WHERE status = 1 ORDER BY name";
	   $result = $conn->query($query);
	   
	   if ($result) {
	       while ($row = $result->fetch_assoc()) {
	           $jsondata['data'][] = $row;
	       }
	   } else {
	       $jsondata['error'] = 'Error loading roles';
	   }
	   
	   echo json_encode($jsondata);
	}

	function loadRolePermissionsFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];
	    
	    $roleId = $_POST['role_id'];
	    
	    try {
	        // Get all menu items
	        $menuQuery = "SELECT id, name, icon, url, parent_id, order_position 
	                     FROM menu_items 
	                     WHERE status = 1 
	                     ORDER BY COALESCE(parent_id, id), order_position";
	        $result = $conn->query($menuQuery);
	        if (!$result) {
	            throw new Exception("Error loading menu items: " . $conn->error);
	        }
	        
	        $menuItems = [];
	        while ($row = $result->fetch_assoc()) {
	            $menuItems[] = [
	                'id' => (int)$row['id'],
	                'name' => $row['name'],
	                'icon' => $row['icon'],
	                'url' => $row['url'],
	                'parent_id' => $row['parent_id'] ? (int)$row['parent_id'] : null,
	                'order_position' => (int)$row['order_position']
	            ];
	        }
	        
	        // Get current permissions
	        $permissionQuery = "SELECT menu_item_id 
	                           FROM role_permissions 
	                           WHERE role_id = ?";
	        
	        $stmt = $conn->prepare($permissionQuery);
	        $stmt->bind_param("i", $roleId);
	        if (!$stmt->execute()) {
	            throw new Exception("Error loading permissions: " . $conn->error);
	        }
	        
	        $result = $stmt->get_result();
	        $permissions = [];
	        while ($row = $result->fetch_assoc()) {
	            $permissions[] = (int)$row['menu_item_id'];
	        }
	        
	        $jsondata['data'] = [
	            'menu_items' => $menuItems,
	            'permissions' => $permissions
	        ];
	        
	    } catch (Exception $e) {
	        $jsondata['error'] = $e->getMessage();
	    }
	    
	    echo json_encode($jsondata);
	}

	function savePermissionsFunction() {
	   global $conn;
	   $jsondata = ['error' => '', 'message' => ''];
	   
	   $roleId = $_POST['role_id'];
	   $permissions = json_decode($_POST['permissions'], true);
	   
	   try {
	       $conn->begin_transaction();
	       
	       // Delete existing permissions
	       $deleteQuery = "DELETE FROM role_permissions WHERE role_id = ?";
	       $stmt = $conn->prepare($deleteQuery);
	       $stmt->bind_param("i", $roleId);
	       if (!$stmt->execute()) {
	           throw new Exception("Error deleting existing permissions");
	       }
	       
	       // Insert new permissions
	       if (!empty($permissions)) {
	           $insertQuery = "INSERT INTO role_permissions (role_id, menu_item_id) VALUES (?, ?)";
	           $stmt = $conn->prepare($insertQuery);
	           
	           foreach ($permissions as $menuId) {
	               $stmt->bind_param("ii", $roleId, $menuId);
	               if (!$stmt->execute()) {
	                   throw new Exception("Error inserting permission");
	               }
	           }
	       }
	       
	       $conn->commit();
	       $jsondata['message'] = 'Permissions saved successfully!';
	       
	   } catch (Exception $e) {
	       $conn->rollback();
	       $jsondata['error'] = $e->getMessage();
	   }
	   
	   echo json_encode($jsondata);
	}

	function loadTeamsSelectFunction() {
	  global $conn;
	  $jsondata = ['error' => '', 'data' => []];

	  $query = "SELECT id, name 
	            FROM teams
	            WHERE status = 1
	            ORDER BY name";

	  $result = $conn->query($query);

	  if ($result) {
	    while ($row = $result->fetch_assoc()) {
	      $jsondata['data'][] = $row;
	    }
	  } else {
	    $jsondata['error'] = 'Error loading teams';
	  }

	  echo json_encode($jsondata);
	}

	function loadUsersSelectFunction() {
	  global $conn;
	  $jsondata = ['error' => '', 'data' => []];

	  $query = "SELECT id, name 
	            FROM users
	            WHERE status = 1
	            ORDER BY name";

	  $result = $conn->query($query);

	  if ($result) {
	    while ($row = $result->fetch_assoc()) {
	      $jsondata['data'][] = $row;
	    }
	  } else {
	    $jsondata['error'] = 'Error loading users';
	  }

	  echo json_encode($jsondata);
	}

	function loadReferralSourcesSelectFunction() {
	  global $conn;
	  $jsondata = ['error' => '', 'data' => []];

	  $query = "SELECT id, name 
	            FROM referral_source
	            WHERE status = 1
	            ORDER BY name";

	  $result = $conn->query($query);

	  if ($result) {
	    while ($row = $result->fetch_assoc()) {
	      $jsondata['data'][] = $row;
	    }
	  } else {
	    $jsondata['error'] = 'Error loading referral sources';
	  }

	  echo json_encode($jsondata);
	}

	function loadCompaniesSelectFunction() {
	  global $conn;
	  $jsondata = ['error' => '', 'data' => []];

	  $query = "SELECT id, company_name 
	            FROM companies_software
	            WHERE status = 1
	            ORDER BY company_name";

	  $result = $conn->query($query);

	  if ($result) {
	    while ($row = $result->fetch_assoc()) {
	      $jsondata['data'][] = $row;
	    }
	  } else {
	    $jsondata['error'] = 'Error loading companies';
	  }

	  echo json_encode($jsondata);
	}

	function loadCustomersFunction() {
	  global $conn;
	  $jsondata = ['error' => '', 'data' => []];

	  $query = "SELECT 
	              c.id, 
	              c.first_name, 
	              c.last_name, 
	              cs.company_name, 
	              c.phone1, 
	              c.email1, 
	              c.city, 
	              t.name as assigned_team_name,
	              DATE_FORMAT(c.date_created, '%d-%m-%Y') as date_created,
	              c.status
	           FROM customers c
	           LEFT JOIN companies_software cs ON c.company_id = cs.id
	           LEFT JOIN teams t ON c.assigned_team_id = t.id
	           ORDER BY c.first_name, c.last_name";

	  $result = $conn->query($query);

	  if ($result) {
	    while ($row = $result->fetch_assoc()) {
	      $jsondata['data'][] = $row;
	    }
	  } else {
	    $jsondata['error'] = 'Error loading customers';
	  }

	  echo json_encode($jsondata);
	}

	function saveCustomerFunction() {
		global $conn;
		$jsondata = ['error' => '', 'message' => ''];

		$customerData = json_decode($_POST['customer_data'], true);
		$customerId = isset($_POST['customer_id']) ? $_POST['customer_id'] : null;

		try {
		$conn->begin_transaction();

		if ($customerId) {
		  // Update customer
		  $query = "UPDATE customers SET
		            first_name = ?, last_name = ?, company_id = ?,
		            phone1 = ?, is_mobile1 = ?, email1 = ?,
		            phone2 = ?, is_mobile2 = ?, email2 = ?,
		            address1 = ?, address2 = ?, city = ?, state = ?,
		            zip = ?, country = ?, referral_source_id = ?,
		            assigned_user_id = ?, assigned_team_id = ?, additional_info = ?
		            WHERE id = ?";
		  $stmt = $conn->prepare($query);
		  $stmt->bind_param(
		    "ssisssissssssssssisi",
		    $customerData['first_name'], $customerData['last_name'], $customerData['company_id'],
		    $customerData['phone1'], $customerData['is_mobile1'], $customerData['email1'],
		    $customerData['phone2'], $customerData['is_mobile2'], $customerData['email2'],
		    $customerData['address1'], $customerData['address2'], $customerData['city'], $customerData['state'],
		    $customerData['zip'], $customerData['country'], $customerData['referral_source_id'],
		    $customerData['assigned_user_id'], $customerData['assigned_team_id'], $customerData['additional_info'],
		    $customerId
		  );
		} else {
		  // Insert new customer
		  $query = "INSERT INTO customers (
		            first_name, last_name, company_id, phone1, is_mobile1, email1,
		            phone2, is_mobile2, email2, address1, address2, city, state,
		            zip, country, referral_source_id, assigned_user_id, assigned_team_id, additional_info,
		            date_created, status
		          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)";
		  $stmt = $conn->prepare($query);
		  $stmt->bind_param(
		    "ssisssisssssssssssi",
		    $customerData['first_name'], $customerData['last_name'], $customerData['company_id'],
		    $customerData['phone1'], $customerData['is_mobile1'], $customerData['email1'],
		    $customerData['phone2'], $customerData['is_mobile2'], $customerData['email2'],
		    $customerData['address1'], $customerData['address2'], $customerData['city'], $customerData['state'],
		    $customerData['zip'], $customerData['country'], $customerData['referral_source_id'],
		    $customerData['assigned_user_id'], $customerData['assigned_team_id'], $customerData['additional_info']
		  );
		}

		$stmt->execute();

		$conn->commit();
		$jsondata['message'] = $customerId ? 'Customer updated successfully!' : 'Customer saved successfully!';
		} catch (Exception $e) {
		$conn->rollback();
		$jsondata['error'] = 'Error: ' . $e->getMessage();
		}

		echo json_encode($jsondata);
		}

	function updateCustomerStatusFunction() {
	  global $conn;
	  $jsondata = ['error' => '', 'message' => ''];

	  $customerId = $_POST['customer_id'];
	  $status = $_POST['status'];

	  $query = "UPDATE customers SET status = ? WHERE id = ?";
	  $stmt = $conn->prepare($query);
	  $stmt->bind_param("ii", $status, $customerId);

	  if ($stmt->execute()) {
	    $jsondata['message'] = 'Customer status updated successfully!';
	  } else {
	    $jsondata['error'] = 'Error updating customer status: ' . $conn->error;
	  }

	  echo json_encode($jsondata);
	}

	function getCustomerInfoFunction() {
	  global $conn;
	  $jsondata = ['error' => '', 'data' => null];

	  $customerId = $_POST['customer_id'];

	  $query = "SELECT 
	              c.id, 
	              c.first_name, 
	              c.last_name, 
	              c.company_id, 
	              cs.company_name,
	              c.phone1, 
	              c.is_mobile1, 
	              c.email1, 
	              c.phone2, 
	              c.is_mobile2, 
	              c.email2, 
	              c.address1, 
	              c.address2, 
	              c.city, 
	              c.state, 
	              c.zip, 
	              c.country, 
	              c.referral_source_id, 
	              c.assigned_user_id, 
	              c.assigned_team_id, 
	              c.additional_info
	            FROM customers c
	            LEFT JOIN companies_software cs ON c.company_id = cs.id
	            WHERE c.id = ?";

	  $stmt = $conn->prepare($query);
	  $stmt->bind_param("i", $customerId);

	  if ($stmt->execute()) {
	    $result = $stmt->get_result();
	    $jsondata['data'] = $result->fetch_assoc();
	  } else {
	    $jsondata['error'] = 'Error fetching customer data';
	  }
//error_log(print_r($jsondata,true));
	  echo json_encode($jsondata);
	}

	function loadTeamsFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];
	    
	    $query = "SELECT t.id, t.name, t.description, 
	              DATE_FORMAT(t.date_created, '%d-%m-%Y') as date_created,
	              t.status,
	              GROUP_CONCAT(CONCAT(u.name, ' ', u.last_name) SEPARATOR ', ') as members
	              FROM teams t
	              LEFT JOIN team_members tm ON t.id = tm.team_id
	              LEFT JOIN users u ON tm.user_id = u.id
	              GROUP BY t.id
	              ORDER BY t.name";
	    
	    $result = $conn->query($query);
	    
	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading teams';
	    }
	    
	    echo json_encode($jsondata);
	}

	function saveTeamFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];
	    
	    try {
	        $conn->begin_transaction();
	        
	        $name = $_POST['name'];
	        $description = $_POST['description'];
	        $members = isset($_POST['members']) ? json_decode($_POST['members'], true) : [];
	        $teamId = isset($_POST['id']) ? $_POST['id'] : null;
	        
	        if ($teamId) {
	            // Update
	            $query = "UPDATE teams SET name = ?, description = ? WHERE id = ?";
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param("ssi", $name, $description, $teamId);
	            $stmt->execute();

	            // Delete existing members
	            $query = "DELETE FROM team_members WHERE team_id = ?";
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param("i", $teamId);
	            $stmt->execute();
	        } else {
	            // Insert
	            $query = "INSERT INTO teams (name, description) VALUES (?, ?)";
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param("ss", $name, $description);
	            $stmt->execute();
	            $teamId = $conn->insert_id;
	        }

	        // Insert new members
	        if (!empty($members)) {
	            $query = "INSERT INTO team_members (team_id, user_id) VALUES (?, ?)";
	            $stmt = $conn->prepare($query);
	            foreach ($members as $userId) {
	                $stmt->bind_param("ii", $teamId, $userId);
	                $stmt->execute();
	            }
	        }

	        $conn->commit();
	        $jsondata['message'] = $teamId ? 'Team updated successfully!' : 'Team saved successfully!';
	        
	    } catch (Exception $e) {
	        $conn->rollback();
	        $jsondata['error'] = 'Error: ' . $e->getMessage();
	    }
	    
	    echo json_encode($jsondata);
	}

	function getTeamInfoFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => null];
	    
	    $id = $_POST['id'];
	    
	    $query = "SELECT t.*, 
	              GROUP_CONCAT(tm.user_id) as member_ids
	              FROM teams t
	              LEFT JOIN team_members tm ON t.id = tm.team_id
	              WHERE t.id = ?
	              GROUP BY t.id";
	              
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("i", $id);
	    
	    if ($stmt->execute()) {
	        $result = $stmt->get_result();
	        $jsondata['data'] = $result->fetch_assoc();
	    } else {
	        $jsondata['error'] = 'Error fetching team data';
	    }
	    
	    echo json_encode($jsondata);
	}

	function getAvailableUsersFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];
	    
	    $query = "SELECT id, CONCAT(name, ' ', last_name) as full_name 
	              FROM users 
	              WHERE status = 1 
	              ORDER BY name";
	    
	    $result = $conn->query($query);
	    
	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading users';
	    }
	    
	    echo json_encode($jsondata);
	}

	function loadReferralSourcesFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];
	    
	    $query = "SELECT id, name, description, 
	              DATE_FORMAT(date_created, '%d-%m-%Y') as date_created, 
	              status 
	              FROM referral_source 
	              ORDER BY name";
	    
	    $result = $conn->query($query);
	    
	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading referral sources';
	    }
	    
	    echo json_encode($jsondata);
	}

	function saveReferralSourceFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];
	    
	    $name = $_POST['name'];
	    $description = $_POST['description'];
	    $id = isset($_POST['id']) ? $_POST['id'] : '';
	    
	    try {
	        if ($id) {
	            // Update
	            $query = "UPDATE referral_source SET 
	                     name = ?, description = ? 
	                     WHERE id = ?";
	            
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param("ssi", $name, $description, $id);
	            
	            if ($stmt->execute()) {
	                $jsondata['message'] = 'Referral source updated successfully!';
	            } else {
	                throw new Exception("Error updating referral source");
	            }
	        } else {
	            // Insert
	            $query = "INSERT INTO referral_source (name, description, date_created, status) 
	                     VALUES (?, ?, NOW(), 1)";
	            
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param("ss", $name, $description);
	            
	            if ($stmt->execute()) {
	                $jsondata['message'] = 'Referral source saved successfully!';
	            } else {
	                throw new Exception("Error saving referral source");
	            }
	        }
	    } catch (Exception $e) {
	        $jsondata['error'] = 'Error: ' . $e->getMessage();
	    }
	    
	    echo json_encode($jsondata);
	}

	function getReferralSourceInfoFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => null];
	    
	    $id = $_POST['id'];
	    
	    $query = "SELECT * FROM referral_source WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("i", $id);
	    
	    if ($stmt->execute()) {
	        $result = $stmt->get_result();
	        $jsondata['data'] = $result->fetch_assoc();
	    } else {
	        $jsondata['error'] = 'Error fetching referral source data';
	    }
	    
	    echo json_encode($jsondata);
	}

	function saveCarrierFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'message' => ''];
	    
	    $carrierData = $_POST['carrierData'];
	    $carrierId = isset($_POST['carrierId']) ? $_POST['carrierId'] : '';
	    
	    try {
	        if ($carrierId) {
	            // Update
	            $query = "UPDATE carriers SET 
	                name = ?, mc_number = ?, phone = ?, email = ?, 
	                address = ?, carrier_main_contact = ?, contact_phone = ?,
	                dispatcher = ?, dispatcher_phone = ?, dispatcher_email = ?,
	                billing_contact = ?, billing_email = ?
	                WHERE id = ?";
	            
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param(
	                "ssssssssssssi",
	                $carrierData['name'], $carrierData['mc_number'],
	                $carrierData['phone'], $carrierData['email'],
	                $carrierData['address'], $carrierData['carrier_main_contact'],
	                $carrierData['contact_phone'], $carrierData['dispatcher'],
	                $carrierData['dispatcher_phone'], $carrierData['dispatcher_email'],
	                $carrierData['billing_contact'], $carrierData['billing_email'],
	                $carrierId
	            );
	            
	            if ($stmt->execute()) {
	                $jsondata['message'] = 'Carrier updated successfully!';
	            } else {
	                throw new Exception("Error updating carrier");
	            }
	        } else {
	            // Insert
	            $query = "INSERT INTO carriers (
	                name, mc_number, phone, email, address, 
	                carrier_main_contact, contact_phone, dispatcher,
	                dispatcher_phone, dispatcher_email, billing_contact,
	                billing_email, date_created, status
	            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)";
	            
	            $stmt = $conn->prepare($query);
	            $stmt->bind_param(
	                "ssssssssssss",
	                $carrierData['name'], $carrierData['mc_number'],
	                $carrierData['phone'], $carrierData['email'],
	                $carrierData['address'], $carrierData['carrier_main_contact'],
	                $carrierData['contact_phone'], $carrierData['dispatcher'],
	                $carrierData['dispatcher_phone'], $carrierData['dispatcher_email'],
	                $carrierData['billing_contact'], $carrierData['billing_email']
	            );
	            
	            if ($stmt->execute()) {
	                $jsondata['message'] = 'Carrier saved successfully!';
	            } else {
	                throw new Exception("Error saving carrier");
	            }
	        }
	    } catch (Exception $e) {
	        $jsondata['error'] = 'Error: ' . $e->getMessage();
	    }
	    
	    echo json_encode($jsondata);
	}

	function getCarrierInfoFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => null];
	    
	    $id = $_POST['id'];
	    
	    $query = "SELECT * FROM carriers WHERE id = ?";
	    $stmt = $conn->prepare($query);
	    $stmt->bind_param("i", $id);
	    
	    if ($stmt->execute()) {
	        $result = $stmt->get_result();
	        $jsondata['data'] = $result->fetch_assoc();
	    } else {
	        $jsondata['error'] = 'Error fetching carrier data';
	    }
	    //error_log(json_encode($jsondata));
	    echo json_encode($jsondata);
	}

	function loadCarriersFunction() {
	    global $conn;
	    $jsondata = ['error' => '', 'data' => []];
	    
	    $query = "SELECT id, name, mc_number, phone, 
	              carrier_main_contact, date_created, status
	              FROM carriers ORDER BY name";
	    
	    $result = $conn->query($query);
	    
	    if ($result) {
	        while ($row = $result->fetch_assoc()) {
	            $jsondata['data'][] = $row;
	        }
	    } else {
	        $jsondata['error'] = 'Error loading carriers';
	    }
	    
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
		$sql = "SELECT orders.id, 
				   'Order' AS type, 
				   DATE_FORMAT(shipment_first_avalilable_pickup_date, '%m/%d/%Y') AS date_created, 
				   orders.status, 
				   CONCAT(customers.first_name, ' ', customers.last_name)  AS customer_name, 
				   origin_contact_phone_1 AS phone, 
				   customers.email1  AS customer_email, 
				   '' AS customer_vehicles 
				FROM orders
				INNER JOIN customers
				ON customers.id = orders.id_customer ";

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
    //error_log($query);
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

		$query = "SELECT physical_zip as zipcode, physical_city as city, locale_name as town, district_name as country
					FROM zip_detail zd ";

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

		$query = "SELECT 
						id, 
						first_name, 
						last_name, 
						phone1, 
						email1, 
						company_id, 
						state, 
						zip, 
						country, 
						assigned_user_id, 
						status, 
						city, 
						address1  
					FROM customers 
					WHERE status = 1";

		$result = $conn->query($query);

		if ($result) {
			while($row = $result->fetch_assoc()) {
			    $data[] = $row;
			}
		} else {
			$error = 'Error fetching zipcode data: '.$conn->error;
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

	function logoutFunction() {
	    session_destroy();
	    $jsondata = [
	        'error' => '',
	        'message' => 'Logged out successfully'
	    ];
	    echo json_encode($jsondata);
	}

	function signInFunction() {
	    global $conn;
	    $jsondata = array();
	    $error = '';
	    $message = '';
	    $email = $_POST['email'];
	    $pass = $_POST['pass'];
	    $code = '';

	    try {
	        // Preparar la consulta para evitar inyección SQL
	        $query = "SELECT id, name, last_name, email, code, role, status 
	                 FROM users u 
	                 WHERE email = ?";
	                 
	        $stmt = $conn->prepare($query);
	        $stmt->bind_param("s", $email);
	        $stmt->execute();
	        $result = $stmt->get_result();

	        if ($result && $row = $result->fetch_assoc()) {
	            if ($row['status'] != 1) {
	                throw new Exception('User account is inactive.');
	            }

	            if (password_verify($pass, $row['code'])) {
	                // Iniciar sesión
	                //session_start();
	                
	                // Guardar datos importantes en la sesión
	                $_SESSION['user_id'] = $row['id'];
	                $_SESSION['user_name'] = $row['name'];
	                $_SESSION['user_lastname'] = $row['last_name'];
	                $_SESSION['user_email'] = $row['email'];
	                $_SESSION['user_role'] = $row['role'];
	                $_SESSION['logged_in'] = true;
	                $_SESSION['login_time'] = time();

	                // Actualizar último acceso en la base de datos (opcional)
	                $updateQuery = "UPDATE users SET last_login = NOW() WHERE id = ?";
	                $stmt = $conn->prepare($updateQuery);
	                $stmt->bind_param("i", $row['id']);
	                $stmt->execute();

	                $message = "Welcome {$row['name']} {$row['last_name']}";
	                
	                // Obtener los permisos del usuario (opcional)
	                $permissionsQuery = "SELECT menu_item_id 
	                                   FROM role_permissions 
	                                   WHERE role_id = ?";
	                $stmt = $conn->prepare($permissionsQuery);
	                $stmt->bind_param("i", $row['role']);
	                $stmt->execute();
	                $permissionsResult = $stmt->get_result();
	                
	                $permissions = [];
	                while ($perm = $permissionsResult->fetch_assoc()) {
	                    $permissions[] = $perm['menu_item_id'];
	                }
	                
	                $_SESSION['user_permissions'] = $permissions;
	                
	            } else {
	                throw new Exception('Wrong password or user!');
	            }
	        } else {
	            throw new Exception('Wrong password or user!');
	        }

	    } catch (Exception $e) {
	        $error = $e->getMessage();
	    }

	    $jsondata['message'] = $message;
	    $jsondata['error'] = $error;
	    
	    // Si el login fue exitoso, incluir datos adicionales
	    if (empty($error)) {
	        $jsondata['user'] = [
	            'id' => $_SESSION['user_id'],
	            'name' => $_SESSION['user_name'],
	            'lastname' => $_SESSION['user_lastname'],
	            'email' => $_SESSION['user_email'],
	            'role' => $_SESSION['user_role']
	        ];
	    }
	    
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
