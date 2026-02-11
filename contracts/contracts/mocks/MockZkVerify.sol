// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockZkVerify {
    bool public verificationResult = true;

    function setVerificationResult(bool _verificationResult) external {
        verificationResult = _verificationResult;
    }

    function verifyProofAggregation(
        uint256,
        uint256,
        bytes32,
        bytes32[] calldata,
        uint256,
        uint256
    ) external view returns (bool) {
        return verificationResult;
    }
}
