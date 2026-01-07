# Bugs

## General
- Need a Loading Icon during data process. 
- Need to Remove the Alert box that popup most of the time.
- The Order page seems to acting wired across multiple users. It seems order history is only tracked based on each user that logged in. Not based on customers. Something off.
- UPDATE: Order Tracking and displaying have some Serious issues.
- You can order items as any User. Not just as Admin. 
- Many user type (I think all of them) can brows food and order them
- UPDATE: All this Order process might need some fix. 


## Admin
- Admin should able to Modify Table Seat count and Numbers. Also maybe give this feature to Manager as well.

### Cart
* Add Items To Cart > Checkout > Din In > Place Order Button Press > While Screen Issue (Works if choose Delivery Option)
* In Order History Page, Press Cart Icon Button > Brows Menu > Not directing to brows menu. (But is working if i did this in Brows Menu Page.) UPDATE: This Cart > Brows menu option not work when appear in other pages.
* No Validation for delivery Info Add Page. You can add anything to fields.
* Moving from Any Page to > Admin Page is white screen
* The cart is Global. Witch mean in current state, if Cashier add item to card (witch can do) and Customer can see it  as well

### Inventory
- Add Inventory Item  > Category Option is Not completed. Also can add text in that section instated of selecting categories. That Custom Category Name will be registered without validation error as well.
- Cannot edit inventory
- You can add unrealistic values to Inventory (Example: 200000000 Kg) 
- You can add very long text to item textbox. (UPDATE:  Can break the UI)

UPDATE: Now when i try to log in second time as admin, i direct to while screen, by manually adding `/orders` to URL, I'm able to access to the page.

## Owner

### Employee Management
- Employee Search Icon is weirdly placed. Search bar is not usable due to having very small width  
- Order info is not visible for Owner's Order UI. But if Owner create its own order, it will be display in the UI. 


## Chef

### Chef Menu
- Order is not visible for Chef 
- If Chef order item. then it will  be display in the Menu 

## Waiter
- Order is not displaying if the order is not maid by waiter itself
- There are no option to link or visualize that This specific Table Customers need this specific Order. 
- I don't know if this refresh Button do something or not. Visually Looks like not responding. 
- Report button is not doing anything.
- Cart Button should be removed and Also When opening the Cart windows, it gives a minor visual issues in UI

## Cashier
- Category Tab gives while screen.
- Cart is working when adding items from main UI to bill.
- Currently have to manually select Items. This is not align with the System Process.
- With current UI, I assume this mean that the customer will first goes to Cashier and do the Order. Then cashier will give a table number and Customer sits there and wait. But here even if we follow that path, Current process does not shows any way the waiter to see who just sit and whose just order and what order in the tables through the UI. And also the Customer browsing items and adding to cart > order  is not connecting to with Cashier UI placing orders. (And i don't think in recurrent, you don't pay for Cashier, Waiter come and take the bill and waiter will give that bill to cashier and so on)

## Customer
- Customer should not have to log in for order. 


# My Thoughts
About the Customer and Order tracking, here i would think of a process. 
1. Customer Come to the Restaurant and Sit on a table 
2. Customer open the website and brows items. After adding items to Cart > Select the Table number That Customer is in >  Press Proceed. (Lets ignore online order for now)
3. Waiter gets the notification through the UI about the order and the Table Number, then waiter move to that table, Confirm the order with Customer And Send the order to Kitchen. 
4. At the end of the Process, Waiter goes to Cashier, Cashier already procced the bill. Waiter grab the bill and give it to the customer, waiter get customer credit card /money and give it to Cashier and pay and Ordre Complete in Cashier UI, and whole process is completed.  


Here’s how I’m thinking the process should work:
1. **Arrival:** The customer comes into the restaurant and sits at a table.
2. **Ordering:** The customer opens the website and browses the items. After adding items to the cart, they select their table number and press "Proceed." (Let’s ignore online orders for now).
3. **Confirmation:** The waiter gets a notification through the UI showing the order and the table number. The waiter then goes to that table, confirms the order with the customer (This verification step is just for practical reasons) , and sends it to the kitchen.
4. **Payment and Completion:** At the end of the meal, the waiter goes to the cashier, who has already processed the bill. The waiter grabs the bill and gives it to the customer. The waiter then takes the customer's cash or credit card to the cashier to settle the payment. Once the order is marked as complete in the cashier UI, the whole process is finished.