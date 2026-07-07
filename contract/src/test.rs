#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_create_receipt() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, PaymentReceiptContract);
    let client = PaymentReceiptContractClient::new(&env, &contract_id);

    let sender = Address::generate(&env);
    let receiver = Address::generate(&env);
    let amount = 10000000;
    let memo = String::from_str(&env, "Test payment");
    let timestamp = 1678888888;
    let tx_hash = String::from_str(&env, "0x123abc");

    let receipt_id = client.create_receipt(&sender, &receiver, &amount, &memo, &timestamp, &tx_hash);
    assert_eq!(receipt_id, 1);

    let receipt = client.get_receipt(&receipt_id).unwrap();
    assert_eq!(receipt.sender, sender);
    assert_eq!(receipt.receiver, receiver);
    assert_eq!(receipt.amount, amount);
    assert_eq!(receipt.status, ReceiptStatus::Pending);

    // Test list_receipts
    let user_receipts = client.list_receipts(&sender);
    assert_eq!(user_receipts.len(), 1);

    // Test update_status
    client.update_status(&receipt_id, &ReceiptStatus::Confirmed);
    let updated_receipt = client.get_receipt(&receipt_id).unwrap();
    assert_eq!(updated_receipt.status, ReceiptStatus::Confirmed);
}
