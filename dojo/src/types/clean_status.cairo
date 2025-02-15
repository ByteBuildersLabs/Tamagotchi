#[derive(Copy, Drop, Serde)]
enum CleanStatus {
    Clean,
    SlightlyDirty,
    Dirty,
    VeryDirty,
    SuperDirty,
    Filthy,
    None,
}

impl IntoCleanStatusFelt252 of core::Into<CleanStatus, felt252> {
    #[inline(always)]
    fn into(self: CleanStatus) -> felt252 {
        match self {
            CleanStatus::None => '',
            CleanStatus::Clean => 'Clean',
            CleanStatus::SlightlyDirty => 'SlightlyDirty',
            CleanStatus::Dirty => 'Dirty',
            CleanStatus::VeryDirty => 'VeryDirty',
            CleanStatus::SuperDirty => 'SuperDirty',
            CleanStatus::Filthy => 'Filthy',
        }
    }
}

impl IntoCleanStatusU32 of core::Into<CleanStatus, u32> {
    #[inline(always)]
    fn into(self: CleanStatus) -> u32 {
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

impl IntoU32CleanStatus of core::Into<u32, CleanStatus> {
    #[inline]
    fn into(self: u32) -> CleanStatus {
        let clean_status: u32 = self.into();
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
