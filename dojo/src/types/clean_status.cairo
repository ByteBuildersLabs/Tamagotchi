use core::traits::Into;

#[derive(Copy, Drop, Serde)]
pub enum CleanStatus {
    Clean,
    SlightlyDirty,
    Dirty,
    VeryDirty,
    SuperDirty,
    Filthy,
    None,
}

pub impl IntoCleanStatusU8 of Into<CleanStatus, u8> {
    #[inline(always)]
    fn into(self: CleanStatus) -> u8 {
        match self {
            CleanStatus::None => 0,
            CleanStatus::Clean => 1,
            CleanStatus::SlightlyDirty => 2,
            CleanStatus::Dirty => 3,
            CleanStatus::VeryDirty => 4,
            CleanStatus::SuperDirty => 5,
            CleanStatus::Filthy => 6,
        }
    }
}

pub impl IntoU8CleanStatus of Into<u8, CleanStatus> {
    #[inline]
    fn into(self: u8) -> CleanStatus {
        let clean_status: u8 = self.into();
        match clean_status {
            0 =>  CleanStatus::None,
            1 => CleanStatus::Clean,
            2 => CleanStatus::SlightlyDirty,
            3 => CleanStatus::Dirty,
            4 => CleanStatus::VeryDirty,
            5 => CleanStatus::SuperDirty,
            6 => CleanStatus::Filthy,
            _ =>  CleanStatus::None,
        }
    }
}
