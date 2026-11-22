
let selectedTransaction = "";
let transactionAmount = 0;
const MAX_AMOUNT_DIGITS = 10;
let isLoading = false;

function showSlide(slideNumber) {

    if (isLoading) return;

    const targetSlide = document.getElementById("slide" + slideNumber);

    if (!targetSlide) {
        console.error("Slide not found:", slideNumber);
        return;
    }

    isLoading = true;

    const loader = document.getElementById("loading-screen");
    const loaderTitle = loader.querySelector("h2");
    const loaderMessage = loader.querySelector("p");
    const currentSlide = document.querySelector(".screen.active");
    const isVerifyingCard = slideNumber === 5 &&
        currentSlide && currentSlide.id === "slide4";

    loaderTitle.textContent = isVerifyingCard ? "CARD VERIFYING..." : "PLEASE WAIT...";
    loaderMessage.textContent = isVerifyingCard
        ? "Please wait while we verify your card."
        : "Processing your request";
    loader.classList.add("show");

    setTimeout(function () {

        document.querySelectorAll(".screen").forEach(function(slide) {
            slide.classList.remove("active");
        });

        targetSlide.classList.add("active");
        loader.classList.remove("show");
        loaderTitle.textContent = "PLEASE WAIT...";
        loaderMessage.textContent = "Processing your request";

        isLoading = false;

    }, 2000);
}

// START BUTTON

function startATM() {
    showSlide(2);
}

// TRANSACTION SELECTION

function selectTransaction(type) {

    selectedTransaction = type;
    document.getElementById("transaction-error").textContent = "";

    document.getElementById("deposit").classList.remove("selected");
    document.getElementById("withdraw").classList.remove("selected");

    document.getElementById(type).classList.add("selected");
}

// CONTINUE BUTTON

function continueTransaction() {

    if (isLoading) return;

    if (selectedTransaction === "") {
        document.getElementById("transaction-error").textContent =
            "Please select Deposit or Withdraw.";
        return;
    }

    document.getElementById("transaction-type").textContent =
        selectedTransaction.toUpperCase();
    resetAmount();
r̥    showSlide(3);
}

function pressDigit(digit) {
    if (isLoading || !/^\d$/.test(digit)) return;

    const amountInput = document.getElementById("amount");
    const currentAmount = amountInput.value === "0" ? "" : amountInput.value;
    const error = document.getElementById("amount-error");

    if (currentAmount.length >= MAX_AMOUNT_DIGITS) {
        error.textContent = "Maximum amount length reached.";
        return;
    }

    amountInput.value = currentAmount + digit;
    clearAmountMessage();
}

function clearAmount() {
    if (isLoading) return;

    const amountInput = document.getElementById("amount");
    amountInput.value = amountInput.value.slice(0, -1) || "0";
    clearAmountMessage();
}

function submitAmount() {
    if (isLoading) return;

    const amount = Number(document.getElementById("amount").value);
    const error = document.getElementById("amount-error");

    if (!Number.isSafeInteger(amount) || amount <= 0) {
        error.textContent = "Enter an amount greater than ₹0.";
        document.getElementById("transaction-status").textContent = "";
        return;
    }

    error.textContent = "";
    transactionAmount = amount;
    document.getElementById("card-summary").textContent =
        selectedTransaction.toUpperCase() + " • ₹" + formatAmount(amount);
    document.getElementById("card-title").textContent = "INSERT YOUR CARD";
    document.getElementById("card-instructions").textContent =
        "After inserting your bank card, press Continue.";
    document.getElementById("card-continue-button").disabled = false;
    document.getElementById("card-continue-button").textContent = "CONTINUE";
    document.getElementById("transaction-status").textContent = "";
    showSlide(4);
}

function verifyCard() {
    if (isLoading) return;

    document.getElementById("verification-summary").textContent =
        selectedTransaction.toUpperCase() + " • ₹" + formatAmount(transactionAmount);
    showSlide(5);
}

function completeTransaction() {
    if (isLoading) return;

    document.getElementById("completion-detail").textContent =
        selectedTransaction.toUpperCase() + " of ₹" + formatAmount(transactionAmount) +
        " completed successfully.";
    showSlide(6);
}

function endSession() {
    if (isLoading) return;

    selectedTransaction = "";
    resetAmount();
    clearTransactionSelection();
    showSlide(1);
}

function returnToMenu() {
    if (isLoading) return;

    selectedTransaction = "";
    resetAmount();
    clearTransactionSelection();
    showSlide(2);
}

function startWithdrawal() {
    if (isLoading) return;

    selectedTransaction = "withdraw";
    document.getElementById("transaction-type").textContent = "WITHDRAW";
    document.getElementById("withdraw").classList.add("selected");
    document.getElementById("deposit").classList.remove("selected");
    resetAmount();
    showSlide(3);
}

function clearTransactionSelection() {
    document.getElementById("deposit").classList.remove("selected");
    document.getElementById("withdraw").classList.remove("selected");
}

function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0
    }).format(amount);
}

function cancelTransaction() {
    if (isLoading) return;

    resetAmount();
    showSlide(2);
}

function resetAmount() {
    transactionAmount = 0;
    document.getElementById("amount").value = "0";
    clearAmountMessage();
}

function clearAmountMessage() {
    document.getElementById("amount-error").textContent = "";
    document.getElementById("transaction-status").textContent = "";
}

// BACK BUTTON

function goBack() {

    if (isLoading) return;

    selectedTransaction = "";

    clearTransactionSelection();

    showSlide(1);
}
