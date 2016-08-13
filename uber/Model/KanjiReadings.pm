# Class::DBI stuff for accessing kanji_readings database

package KanjiReadings::DBI;
use base 'Class::DBI::SQLite';

# Should probably make DB connection string an option somewhere
# instead of hard-wiring it.

KanjiReadings::DBI->connection(
    "dbi:SQLite:dbname=/home/dec/JLPT_Study/uber/kanji_readings.sqlite",'','',
    {   # does Class::DBI accept DBI/DBD options like below? Yes.
        RaiseError     => 1,
        sqlite_unicode => 1,
        AutoCommit     => 0, # remember to use dbi_commit!
    }
    );

sub autoupdate        { 1 }

####################

package KanjiReadings::ReadingTally;
use base 'KanjiReadings::DBI';

KanjiReadings::ReadingTally->table('reading_tallies');
KanjiReadings::ReadingTally->columns(
    Primary => qw(kanji read_type kana));
KanjiReadings::ReadingTally->columns(
    Others  => qw(hiragana raw_tally adj_tally));

KanjiReadings::ReadingTally->has_a(kanji => 'KanjiReadings::Summary');

####################

package KanjiReadings::VocabReading;
use base 'KanjiReadings::DBI';

KanjiReadings::VocabReading->table('vocab_readings');
# The following are not actually primary keys, but we need to pretend
# they are so that Class::DBI will work properly when doing has_many
# from Summary table.
KanjiReadings::VocabReading->columns( 
    Primary     => qw(kanji vocab_kanji vocab_kana reading_type));
KanjiReadings::VocabReading->columns(
    Others => qw( reading_hira jlpt_grade
                  reading_kana adj_hira adj_type adj_kana ignore_flag));

KanjiReadings::VocabReading->has_a(kanji => 'KanjiReadings::Summary');

    
####################

package KanjiReadings::Summary;
use base 'KanjiReadings::DBI';

KanjiReadings::Summary->table('summary');
KanjiReadings::Summary->columns(Primary => 'kanji');
KanjiReadings::Summary->columns(Others  => qw(heisig6_seq num_readings adj_readings 
                                              num_vocab num_failed adj_failed));

KanjiReadings::Summary->has_many(
    tallies        => 'KanjiReadings::ReadingTally');
KanjiReadings::Summary->has_many(
    vocab_readings => 'KanjiReadings::VocabReading', 'kanji',
    { order_by => vocab_kanji} );


1;