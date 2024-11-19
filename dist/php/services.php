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
			case 'get_customer_info':
		        getCustomerInfoFunction();
		        break;
	     	case 'load_roles_for_permissions':
			   loadRolesForPermissionsFunction();
			   break;
			case 'load_role_permissions':
			   loadRolePermissionsFunction(); 
			   break;
			case 'save_permissions':
			   savePermissionsFunction();
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
/*
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
*/
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
