#![no_std]


use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ReceiptStatus {
    Pending,
    Confirmed,
    Failed,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Receipt {
    pub id: u64,
    pub sender: Address,
    pub receiver: Address,
    pub amount: i128,
    pub memo: String,
    pub timestamp: u64,
    pub tx_hash: String,
    pub status: ReceiptStatus,
}

#[contracttype]
pub enum DataKey {
    Receipt(u64),
    ReceiptCount,
    UserReceipts(Address), // Map Address to Vec<u64> of receipt IDs
}

const RECEIPT_CREATED: Symbol = symbol_short!("Created");
const RECEIPT_UPDATED: Symbol = symbol_short!("Updated");
const PAYMENT_CONFIRMED: Symbol = symbol_short!("Confirmed");

#[contract]
pub struct PaymentReceiptContract;

#[contractimpl]
impl PaymentReceiptContract {
    pub fn create_receipt(
        env: Env,
        sender: Address,
        receiver: Address,
        amount: i128,
        memo: String,
        timestamp: u64,
        tx_hash: String,
    ) -> u64 {
        sender.require_auth();

        let mut count: u64 = env.storage().instance().get(&DataKey::ReceiptCount).unwrap_or(0);
        count += 1;

        let receipt = Receipt {
            id: count,
            sender: sender.clone(),
            receiver,
            amount,
            memo,
            timestamp,
            tx_hash,
            status: ReceiptStatus::Pending,
        };

        // Save receipt
        env.storage().persistent().set(&DataKey::Receipt(count), &receipt);
        env.storage().instance().set(&DataKey::ReceiptCount, &count);

        // Update user's receipt list
        let mut user_receipts: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::UserReceipts(sender.clone()))
            .unwrap_or(Vec::new(&env));
        user_receipts.push_back(count);
        env.storage().persistent().set(&DataKey::UserReceipts(sender), &user_receipts);

        // Publish event
        env.events().publish((RECEIPT_CREATED, count), receipt);

        count
    }

    pub fn get_receipt(env: Env, id: u64) -> Option<Receipt> {
        env.storage().persistent().get(&DataKey::Receipt(id))
    }

    pub fn list_receipts(env: Env, user: Address) -> Vec<Receipt> {
        let receipt_ids: Vec<u64> = env
            .storage()
            .persistent()
            .get(&DataKey::UserReceipts(user))
            .unwrap_or(Vec::new(&env));

        let mut receipts = Vec::new(&env);
        for id in receipt_ids.iter() {
            if let Some(receipt) = env.storage().persistent().get(&DataKey::Receipt(id)) {
                receipts.push_back(receipt);
            }
        }
        receipts
    }

    pub fn update_status(env: Env, id: u64, new_status: ReceiptStatus) {
        let mut receipt: Receipt = env
            .storage()
            .persistent()
            .get(&DataKey::Receipt(id))
            .unwrap_or_else(|| panic!("Receipt not found"));
            
        receipt.sender.require_auth(); // Only sender can update their receipt in this implementation, or a designated admin
        
        receipt.status = new_status.clone();
        env.storage().persistent().set(&DataKey::Receipt(id), &receipt);

        env.events().publish((RECEIPT_UPDATED, id), new_status.clone());
        if new_status == ReceiptStatus::Confirmed {
            env.events().publish((PAYMENT_CONFIRMED, id), receipt);
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_receipt_status_equality() {
        assert_eq!(ReceiptStatus::Pending, ReceiptStatus::Pending);
        assert_ne!(ReceiptStatus::Pending, ReceiptStatus::Confirmed);
        assert_ne!(ReceiptStatus::Confirmed, ReceiptStatus::Failed);
    }
}

