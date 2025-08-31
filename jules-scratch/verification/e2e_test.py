import time
from playwright.sync_api import sync_playwright, expect

def run_test(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Give the dev server time to start
        time.sleep(10)

        # Unique user for this test run
        unique_username = f"testuser_{int(time.time())}"
        password = "password123"
        birthday_name = "John Doe"
        birthday_date = "2000-01-01"

        # 1. Registration
        page.goto("http://localhost:3000/")
        page.get_by_text("Register here").click()
        expect(page.get_by_role("heading", name="Register")).to_be_visible()
        page.get_by_placeholder("Username").fill(unique_username)
        page.get_by_placeholder("Password").fill(password)
        page.get_by_role("button", name="Register").click()

        # After registration, we are automatically logged in.
        # Wait for the main birthday page to appear.
        expect(page.get_by_role("heading", name=f"Welcome, {unique_username}!")).to_be_visible(timeout=10000)

        # 2. Add a birthday
        page.get_by_placeholder("Name").fill(birthday_name)
        page.get_by_placeholder("Date").fill(birthday_date)
        page.get_by_role("button", name="Add").click()

        # 3. Verify the birthday was added and take a screenshot
        new_birthday_item = page.locator(f"li:has-text('{birthday_name}')")
        expect(new_birthday_item).to_be_visible()
        expect(new_birthday_item).to_contain_text("1/1/2000") # Check formatted date

        page.screenshot(path="jules-scratch/verification/verification.png")

        # 4. Delete the birthday
        new_birthday_item.get_by_role("button", name="Delete").click()
        expect(new_birthday_item).not_to_be_visible()
        expect(page.get_by_text("You haven't added any birthdays yet.")).to_be_visible()

        # 5. Logout
        page.get_by_role("button", name="Logout").click()
        expect(page.get_by_role("heading", name="Login")).to_be_visible()
        print("E2E test completed successfully!")

    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run_test(playwright)
