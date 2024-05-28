// circuit.rs
use bellman::{Circuit, ConstraintSystem, SynthesisError};
use bellman::gadgets::boolean::Boolean;
use bls12_381::Scalar;
use bellman::gadgets::num::AllocatedNum;

pub struct DataCircuit {
    pub num_conversations: Option<Scalar>,
}

impl Circuit<Scalar> for DataCircuit {
    fn synthesize<CS: ConstraintSystem<Scalar>>(self, cs: &mut CS) -> Result<(), SynthesisError> {
        let num_conversations_var = AllocatedNum::alloc(cs.namespace(|| "num_conversations"), || {
            self.num_conversations.ok_or(SynthesisError::AssignmentMissing)
        })?;
        let fifty = AllocatedNum::alloc(cs.namespace(|| "fifty"), || {
            Ok(Scalar::from(50u64))
        })?;
        let diff = AllocatedNum::alloc(cs.namespace(|| "diff"), || {
            let karma_value = self.num_conversations.ok_or(SynthesisError::AssignmentMissing)?;
            Ok(karma_value - Scalar::from(50u64))
        })?;
        cs.enforce(
            || "enforce num_conversations = diff + 50",
            |lc| lc + num_conversations_var.get_variable(),
            |lc| lc + CS::one(),
            |lc| lc + diff.get_variable() + fifty.get_variable()
        );

        // Decompose diff into bits and ensure it is positive
        let diff_bits = diff.to_bits_le(cs.namespace(|| "diff bits"))?;
        Boolean::enforce_equal(
            cs.namespace(|| "diff is positive"),
            &diff_bits.last().expect("bit decomposition should not be empty"),
            &Boolean::constant(false),
        )?;

        Ok(())
    }
}
