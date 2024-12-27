import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PoorTokenModule = buildModule("PoorTokenModule", (m) => {
  const poorToken = m.contract("Poor", []);

  return { poorToken };
});

export default PoorTokenModule;
