App = {
  contracts: {},
  load: async () => {
    await App.loadWeb3(); // load web3
    await App.loadAccount(); // load account
    await App.loadContract(); // load contract
    await App.render(); // render
  },
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },
  loadAccount: async () => {
    App.account = (await web3.eth.getAccounts())[0];
  },
  loadContract: async () => {
    const prescriptionManagement = await $.getJSON(
      "PrescriptionManagement.json"
    );
    App.contracts.PrescriptionManagement = TruffleContract(
      prescriptionManagement
    );
    App.contracts.PrescriptionManagement.setProvider(App.web3Provider);
    App.prescriptionManagement =
      await App.contracts.PrescriptionManagement.deployed();
  },
  render: async () => {
    // Prevent double render
    if (App.loading) {
      return;
    }
    // Update app loading state
    App.setLoading(true);
    // Render Account
    $("#account").html(App.account);
    await App.renderPrescriptions();
    // Update loading state
    App.setLoading(false);
  },
  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
  renderPrescriptions: async () => {
    const prescriptionCount =
      await App.prescriptionManagement.prescriptionCounter();
    const $prescriptionTemplate = $(".prescriptionTemplate");
    for (var i = 1; i <= prescriptionCount; i++) {
      const prescription = await App.prescriptionManagement.prescriptions(i);
      const prescriptionId = prescription[0].toNumber();
      const prescriptionDoctor = prescription[1];
      const prescriptionPatient = prescription[2];
      const prescriptionDetails = prescription[3].toNumber();
      const prescriptionIsFilled = prescription[4];

      const $newPrescriptionTemplate = $prescriptionTemplate.clone();
      $newPrescriptionTemplate.find(".content").html(prescriptionDetails);
      $newPrescriptionTemplate
        .find("input")
        .prop("name", prescriptionId)
        .prop("checked", prescriptionIsFilled);
      //.on("click", App.toggleFilled);
      if (prescriptionIsFilled) {
        $("#completedPrescriptionList").append($newPrescriptionTemplate);
      } else {
        $("#prescriptionList").append($newPrescriptionTemplate);
      }
      $newPrescriptionTemplate.show();
    }
  },
};
$(() => {
  $(window).load(() => {
    App.load();
  });
});
