(function() {
	const { Component } = owl;
	const { xml } = owl.tags;
	const { whenReady } = owl.utils;

	const { useState } = owl.hooks;

	const networkData = JSON.parse(document.getElementById('network-data').textContent);

	// -------------------------------------------------------------------------
	// App Component
	// -------------------------------------------------------------------------
	const APP_TEMPLATE = xml /* xml */`
<div class="container py-5 my-5 rounded shadow">
	<div class="row">
		<h2 class="col-12 text-center">Calculate your staking rewards</h2>
	</div>
	<div class="py-3 d-flex flex-column flex-md-row">
		<div class="d-flex flex-column flex-fill">
			<p class="py-0 my-0"><t t-esc="env.network.title" /> amount (<t t-esc="env.network.network.token.name" />)</p>
			<div class="d-flex flex-row">
				<input type="number" t-model.number="state.amount" t-on-input="updateAbount"/>
				<p><t t-esc="state.amountUsdt" /> USDT</p>
			</div>
		</div>
		<div class="d-flex flex-column text-end justify-content-end">
			<p class="py-0 my-0">Annualized reward</p>
			<p class="py-0 my-0"><t t-esc="env.network.staking.apr" />%</p>
		</div>
	</div>

	<div class="row">
		<input class="col" min="50000" max="64000000" step="50000" type="range" t-model.number="state.amount" t-on-input="updateAbount"/>
	</div>
	<div class="row">
		<smal class="col-12">All numbers provided should be considered approximate calculations of possible performance</smal>
	</div>
	<div class="row rounded">
		<table class="table table-secondary">
			<tbody>
				<tr>
					<td>Daily earnings</td>
					<td><t t-esc="state.dailyErnings"/> <t t-esc="env.network.network.symbol"/></td>
					<td><t t-esc="state.dailyErningsUsdt"/> USDT</td>
				</tr>
				<tr>
					<td>Monthly earnings</td>
					<td><t t-esc="state.monthlyErnings"/> <t t-esc="env.network.network.symbol"/></td>
					<td><t t-esc="state.dailyErningsUsdt"/> USDT</td>
				</tr>
				<tr>
					<td>Yearly earnings</td>
					<td><t t-esc="state.yearlyErnings"/> <t t-esc="env.network.network.symbol"/></td>
					<td><t t-esc="state.dailyErningsUsdt"/> USDT</td>
				</tr>
			</tbody>
		</table>
		<div>
			<button type="button" class="mx-1 btn btn-primary">Stake Now</button>
			<button type="button" class="mx-1 btn btn-info">Get offer</button>
		</div>
	</div>
</div>`;

	class App extends Component {
		static template = APP_TEMPLATE;
		static props = ['network'];
		state = useState({
			amount: 1000,
			amountUsdt: 0,
			dailyErnings: 0,
			dailyErningsUsdt: 0,
			monthlyErnings: 0,
			monthlyErningsUsdt: 0,
			yearlyErnings: 0,
			yearlyErningsUsdt: 0
		});

		constructor() {
			super();
			this._setAmount(50000);
		}

		updateAbount(event) {
			let amount = parseInt(event.target.value);
			this._setAmount(amount);
		}

		_setAmount(amount) {
			let price = this.env.network.network.token.price;
			let apr = this.env.network.staking.apr;

			this.state.amount = amount;
			this.state.amountUsdt = amount * price;

			let ern = amount * apr;
			this.state.dailyErnings = ern / 366.0;
			this.state.dailyErningsUsdt = ern * price / 366.0;

			this.state.monthlyErnings = ern / 12.0;
			this.state.monthlyErningsUsdt = ern * price / 12.0;

			this.state.yearlyErnings = ern;
			this.state.yearlyErningsUsdt = ern * price;
		}
	}

	// Setup code
	function setup() {
		App.env.network = networkData;
		const app = new App();
		app.mount(document.getElementById('app-staking-reward-calculator'));
	}

	whenReady(setup);
})();
