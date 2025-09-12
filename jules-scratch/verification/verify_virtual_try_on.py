from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:3000/products/1")

    # Click the Virtual Try-On button
    page.get_by_role("button", name="Virtual Try-On").click()

    # Wait for the modal to appear
    expect(page.get_by_role("heading", name="Virtual Try-On")).to_be_visible()

    # Upload the human image
    page.get_by_label("Your Image").set_input_files("https://cdn.stocksnap.io/img-thumbs/280h/fashion-woman_QQHFI13JZG.jpg")

    # Click the Generate Try-On button
    page.get_by_role("button", name="Generate Try-On").click()

    # Wait for the result image to be displayed and take a screenshot
    expect(page.get_by_alt_text("Virtual Try-On Result")).to_be_visible()
    page.screenshot(path="jules-scratch/verification/virtual-try-on.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
