// circuit.rs
use bellman::{Circuit, ConstraintSystem, SynthesisError};
use bellman::gadgets::boolean::Boolean;
use bls12_381::Scalar;
use bellman::gadgets::num::AllocatedNum;

pub struct KarmaDataCircuit {
    pub karma: Option<Scalar>,
}

impl Circuit<Scalar> for KarmaDataCircuit {
    fn synthesize<CS: ConstraintSystem<Scalar>>(self, cs: &mut CS) -> Result<(), SynthesisError> {
        let karma_var = AllocatedNum::alloc(cs.namespace(|| "karma"), || {
            self.karma.ok_or(SynthesisError::AssignmentMissing)
        })?;
        let hundred = AllocatedNum::alloc(cs.namespace(|| "hundred"), || {
            Ok(Scalar::from(100u64))
        })?;
        let diff = AllocatedNum::alloc(cs.namespace(|| "diff"), || {
            let karma_value = self.karma.ok_or(SynthesisError::AssignmentMissing)?;
            Ok(karma_value - Scalar::from(100u64))
        })?;
        cs.enforce(
            || "enforce karma = diff + 100",
            |lc| lc + karma_var.get_variable(),
            |lc| lc + CS::one(),
            |lc| lc + diff.get_variable() + hundred.get_variable()
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
